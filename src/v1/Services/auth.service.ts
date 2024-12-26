import { Transaction, where } from 'sequelize';
const bcrypt = require("bcrypt");
import { errorCatch } from '../../middlewares/error';
import { withTransaction } from '../../Utils/transaction_helper';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { generateToken, verifyToken, TokenPayload, TokenLogin, TokenDevice, TokenRefresh} from '../Secure/tokenJWT';
import { MailActions, MailServiceConfig, MailService } from '../Secure/mails/sendMail';

import { Auth, AuthCreationAttributes } from '../models/auth'; 
import { CodeAutentication } from '../models/code-autentication';
import { User } from '../models/user';
import { UserPage } from '../models/user-page';
import { StatusAuth } from '../models/status-auth';
import { Login } from '../models/login';
import { Devices, DevicesCreationAttributes } from '../models/devices';
import { DeviceAuth, DeviceAuthAttributes } from '../models/device-auth';
import { RefreshToken, RefreshTokenAttributes, RefreshTokenOptionalAttributes } from '../models/refresh-token';

import { CodeAutenticationService } from './code_autentication.service';
import { UserService } from './user.service';
import { ServiceResponse } from '../../Utils/ServiceResponse';

const { v4: uuidv4 } = require('uuid');

interface RequestLogin {
  response:{
    message:string
    deviceVerify: boolean
    TOKEN_DEVICE?: string
    TOKEN_ValidCode?: string
  }
  tokens?:{
    TOKEN_ACCESS?: string
    TOKEN_REFRESH?: string
  }
}

interface AuthResult {
  auth: Auth; // Asumiendo que 'Auth' es el tipo que devuelve 'createAuth'
  codeAuth: CodeAutentication; // Asumiendo que 'CodeAuthentication' es el tipo que devuelve '_createCodeAuthentication'
}

interface LoginParams {
  Username: string;
  Password?: string;
  Code?: string;
}

export interface ParamsLogin {
  Login: LoginParams
  withToken: boolean;
  deviceToken?: string; // Opcional si ya existe el token del dispositivo
  deviceInfo?: DevicesCreationAttributes; // Opcional si no hay token
}


export class AuthService {

  //#region ######################################### CREATION ACOUNT
  public async createAuth(authData: AuthCreationAttributes, transaction: Transaction): Promise<AuthResult> {
    try {

      const hashedPassword = await bcrypt.hash(authData.Password, 10);
      authData = {...authData, Password:hashedPassword}

      const auth = await this.createAuth_Private(authData, transaction);

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: auth.IdAuth,
        IdTypeCode: 1
      }, transaction);

      return {
        auth,
        codeAuth,
      }; 

    } catch (error:any) {
      handleServiceError(error, 'createAuth', error.statusCode)
    } 
  }  
  protected async _generateCodeEmail(Email:string): Promise<ServiceResponse<any>>{
    try {
      
      const userData = await User.findOne({
        where: {Email}
      })    
      if(!userData){
        return {
          code: 422,
          isError: true,
          message: 'El correo es incorrecto'
        };
      }

      const auth = await Auth.findOne({
        where:{IdUser: userData.IdUser}
      })
      if(!auth){
        return {
          code: 422,
          isError: true,
          message: 'El correo es incorrecto'
        };
      }

      if(auth.Status == 2){
        return {
          code: 422,
          isError: true,
          message: 'La cuenta ya se encuentra activa'
        };
      }

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: auth.IdAuth,
        IdTypeCode: 1
      });
      
      const mailConfig: MailServiceConfig = {
        accion:MailActions.CodeAuth,
        to: Email,
        subject: 'Verificar cuenta',
        dataMail: {
          name: userData.Name,
          firstname: userData.Firstname,
          code: codeAuth.Code ?? '',
        }
      };
      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();

      return {
        code: 200,
        isError: false,
        message: '¡Código generado! Te llegará a tu correo electrónico.'
      };

    } catch (error:any) {
      handleServiceError(error, '_generateCodeEmail', error.statusCode)
    }
  }  
  private async createAuth_Private(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error:any) {
      handleServiceError(error, '_createAuth', error.statusCode)
    }
  }
  protected async _validCodeByEmail (Token:string, Code: string): Promise<any> {
    try {
      const response = await this._varifyToken(Token)
      if(!response.valid){
        return {
          code: 422,
          isError: true,
          message: response.message
        };
      }

      const {IdAuth} = response.payload

      const authData = await Auth.findOne({
        where:{IdAuth}
      })
      if(!authData){
        throw errorCatch('El usuario no existe', 422) 
      }
      
      const userData = await User.findOne({
        where: {IdUser: authData.IdUser}
      })    
      if(!userData){
        throw errorCatch('El usuario no existe', 422)     
      }

      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if(dataCode == 0){
        return {
          code: 422,
          isError: true,
          message: 'El Cóodigo es incorrecto',
        };
      }

      authData.Status = 2; //status de auth queda activo=2
      authData.save();

      // 6. Crea code para Iniciar sesión  Tipo=5
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: authData.IdAuth,
        IdTypeCode: 5
      });

      return {
        code: 200,
        isError: false,
        message: {
          Email: userData.Email,
          Code: codeAuth.Code
        },
      };

    } catch (error:any) {
      handleServiceError(error, '_validCodeByEmail', error.statusCode)
    }
  }
  protected async _validViewVerifyEmail(Token:string): Promise<ServiceResponse<any>>{
    const response = await this._varifyToken(Token)
    if(!response.valid){
      return {
        code: 422,
        isError: true,
        message: response.message
      };
    }

    const {IdAuth} = response.payload
    if(!IdAuth){
      return {
        code: 422,
        isError: true,
        message: `Token invalido`
      };
    }

    //Validar si cuenta con un code estatus 3
    const IdTypeCode = 3;
    const codeValid = await CodeAutentication.findOne({
      where: { IdTypeCode, IdAuth:IdAuth }
    });
    if(!codeValid){
      return {
        code: 422,
        isError: true,
        message: 'No cuenta con solicitud de verificacion de correo'
      };
    }

    return {
      code: 200,
      isError: false,
      message: 'Vista autorizada'
    };


  }
  protected async _reSendCode(Token:string): Promise<any> {
    const response = await this._varifyToken(Token)
    if(!response.valid){
      return {
        code: response.code,
        isError: true,
        message: response.message
      };
    }

    const {IdAuth} = response.payload
    const auth = await Auth.findOne({
      where:{IdAuth}
    })
    if(!auth){
      throw errorCatch('No existe registro', 422)
    }

    const IdTypeCode = 3;
    const code_AutService = new CodeAutenticationService();
    const codeAuth = await code_AutService.createNewwCode({
      IdAuth: IdAuth,
      IdTypeCode
    });

    const user = await User.findOne({
      where:{IdUser: auth.IdUser}
    })
    if(!user){
      throw errorCatch('No existe registro', 422)
    }

    // Envía el correo
    const mailConfig: MailServiceConfig = {
      accion: MailActions.CodeAuth,
      to: user.Email,
      subject: 'Código de verificación',
      dataMail: {
        name: user.Name,
        firstname: user.Firstname,
        code: codeAuth.Code ?? '',
      }
    };
    const mailService = new MailService(mailConfig);
    const responseMail = await mailService.send();

    return {
      code: 200,
      isError: false,
      message: 'Se ha enviado correo con nuevo código'
    };

  }
  //#endregion ######################################### CREATION ACOUNT


  //#region ######################################### LOGIN
  protected async loginAfterRegister(params: ParamsLogin): Promise<ServiceResponse<any>> {
    
    try {
      const {Login} = params
      const _Login:LoginParams = Login
      const { Username: Email, Code } = _Login; //Cambio de nombre de variables
 
      const user = await User.findOne({
        where: { Email }
      });
      if(!user){
        return {
          code: 422,
          isError: true,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        };
      }

      const authData = await Auth.findOne({
        where: { IdUser: user.IdUser }
      });
      if(!authData){
        return {
          code: 422,
          isError: true,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        };
      }

      const codeValid = await CodeAutentication.findOne({
        where: { Code, IdAuth:authData.IdAuth }
      });
      if(!codeValid){
        return {
          code: 422,
          isError: true,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        };
      }
      if(!codeValid.IsActive){
        return {
          code: 422,
          isError: true,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        };
      }
      
      await codeValid.update({IsActive:false}) 
      
      const modifiedParams: ParamsLogin = {
        ...params,
        Login: {
          Username: authData.Username, 
          Password: '', 
        },
      };

      // Llamar al servicio de login con los datos correspondientes     
      const loginWhithCode = true
      const responseLogin = await this._login(modifiedParams, loginWhithCode);
      return {
        code: 200,
        isError: false,
        message: responseLogin
      };

    } catch (err:any) {
        handleServiceError(err, 'loginAfterRegister', err.statusCode);
    }
  }
  protected async _login(params: ParamsLogin, whithCode:boolean=false): Promise<any> {
    return await withTransaction(async (transaction)=>{
      try {
        const {withToken, deviceToken, deviceInfo} = params
        
        //Valida parametros
        const dataAuth = await this._validParams(params.Login, whithCode);        
        if(!dataAuth){
          throw errorCatch('Error al iniciar sesión', 422)
        }
        
        //obtiene lista de login
        const IdAuth = dataAuth.IdAuth;        
        const listLogin = await Login.findAll({
          where: { IdAuth }
        });
        if (!deviceInfo) {
          throw errorCatch('Los datos del dispositivo no se encuentran.', 422); 
        }  

        //########### PRIMER LOGIN VALIDA LOGIN Y TOKEN
        if(listLogin.length === 0){   
          const response = await this.lg_first_LOGIN(deviceInfo, dataAuth, transaction);
          return response;               
        } 
        
        //########### MÁS DE UN LOGUEO (NUEVO DISPOSITIVO)
        if(!withToken && listLogin.length >= 1){          
          const response = await this.lg_newDevice_LOGIN(deviceInfo, dataAuth, transaction);
          return response; 
        }  

        //########### MÁS DE UN LOGUEO (EXISTE Dispositivo)
        if(withToken && listLogin.length >= 1){  
          //deviceToken, dataAuth
          if (!deviceToken) {
            throw errorCatch('El token del dispositivo es requerido pero no se proporcionó.', 422); 
          }
          const response = await this.lg_existDevice_LOGIN(deviceToken, dataAuth, transaction);
          return response; 
        }
        
      } catch (err: any) {
        handleServiceError(err, 'Error login', err.statusCode);
      }
    })      
  }
  private async lg_first_LOGIN (deviceInfo:DevicesCreationAttributes, dataAuth:Auth, transaction:any){

    const IdAuth = dataAuth.IdAuth;  
    //* Crear registro en tabla Device con token          
    const device = await this._createDevice(deviceInfo, transaction)
    const deviceaAuth = await DeviceAuth.create({IdAuth, IdDevice:device.IdDevices}, { transaction });
    
    //* se crea un registro en tabla Login con (IdAuth, IdDevice) con activo true 
    const login = await this._createLogin(dataAuth.IdAuth, deviceaAuth.IdDeviceAuth, transaction)

    /**Se obtiene valor del la pagina de usuario para el TOKEN_ACCESS*/
    const userPage = await UserPage.findOne({where:{IdUser: dataAuth.IdUser} });
    if(!userPage){
      throw errorCatch('No existe registro en tabla userPage', 400)
    }

    const dataRefreshToken:TokenRefresh = { IdDeviceAuth: deviceaAuth.IdDeviceAuth};
    const expiracionDias = 30
    const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`); 
    if(!tokenRefresh || tokenRefresh.code != 200){throw errorCatch('Error en el servicio al generar token', 400)} 
    
    const insertTokenRefresh = {
      IdRefreshToken: 0,
      Token: String(tokenRefresh.token),
      ExpiresAt: this.getfechaToken(expiracionDias),
      IsActive: true,
      IdAuth: IdAuth,
      IdDeviceAuth: deviceaAuth.IdDeviceAuth,
    };
    const dataTokenRefresh = await this.createRefreshToken(insertTokenRefresh, transaction)
    const dataRefresh = {
      IdRefreshToken: dataTokenRefresh.IdRefreshToken,
      ExpiresAt: dataTokenRefresh.ExpiresAt || new Date(),
    }

    const dataAccessToken:TokenLogin = { IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
    const tokenLogin = await this._generateToken(dataAccessToken, 'Login'); 
    if(tokenLogin.code != 200){throw errorCatch('Error en el servicio al generar token', 400)}


    const deviceToken = uuidv4(); 
    device.Token = deviceToken
    await this._updateDevice(device, transaction)
    
    const response: RequestLogin = {      
      response:{
        message: '¡Inicio de sesión exitoso! Bienvenido.',
        deviceVerify: true, 
        TOKEN_DEVICE:deviceToken,
      },      
      tokens:{
        TOKEN_ACCESS:tokenLogin.token,
        TOKEN_REFRESH:tokenRefresh.token,
      }
    };
    return response;
  }
  private async lg_existDevice_LOGIN (deviceToken:string, dataAuth:Auth, transaction:any){   
    const IdAuth = dataAuth.IdAuth;  

    /**Se obtiene el registro el device por uuid */
    const device = await Devices.findOne({
      where:{Token: deviceToken}
    }) 
    if(!device){
      throw errorCatch('No se encontro el dispositivo', 422)
    }

    const deviceAuth = await DeviceAuth.findOne({
      where: {IdDevice: device.IdDevices, IdAuth}
    })
    if(!deviceAuth){
      throw errorCatch('No se encontro el dispositivo', 422)
    }
 
    // Validar si no tiene codigos pendientes que verificar en esttus 6 (6='Registro de dispositivo')
    const dataActivo = await CodeAutentication.findOne({
      where:{
        IdAuth:dataAuth.IdAuth,
        IsActive: true,
        IdTypeCode: 6        
      }
    })
    if(dataActivo?.IsActive){      
      const response = await this.lg_sendCode_six(dataAuth, deviceAuth)
      return response;
    }

    //* Actualiza en tabla login todos los registros en el campo activo=false donde el idDevice sea el del token
    await this._updateLoginToInactive(deviceAuth.IdDeviceAuth, IdAuth)

    //* se crea un registro en tabla login con (IdAuth, IdDevice) con activo true
    const login = await this._createLogin(dataAuth.IdAuth, deviceAuth.IdDeviceAuth, transaction)
    
    //* Se obtienen los datos de la pagina de usuario para el TOKEN_ACCESS
    const userPage = await UserPage.findOne({where:{IdUser: dataAuth.IdUser} });
    if(!userPage){
      throw errorCatch('No existe registro en tabla userPage', 422)
    }

    //Se genera token refresh
    const dataRefreshToken:TokenRefresh = { IdDeviceAuth:deviceAuth.IdDevice };
    const expiracionDias = 30
    const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`); 
    if(tokenRefresh.code != 200){throw errorCatch('Error en el servicio al generar token', 400)} 

    //se inserta el token Refresh a la bd
    const insertTokenRefresh = {
      IdRefreshToken: 0,
      Token: String(tokenRefresh.token),
      ExpiresAt: this.getfechaToken(expiracionDias),
      IsActive: true,
      IdAuth: IdAuth,
      IdDeviceAuth: deviceAuth.IdDeviceAuth,
    };
    const dataTokenRefresh = await this.createRefreshToken(insertTokenRefresh, transaction)
    const dataRefresh = {
      IdRefreshToken: dataTokenRefresh.IdRefreshToken,
      ExpiresAt: dataTokenRefresh.ExpiresAt || new Date(),
    }

    /**Se generan los token de Access */
    const dataAccessToken:TokenLogin = { IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
    const tokenLogin = await this._generateToken(dataAccessToken, 'Login');
    if(tokenLogin.code != 200){throw errorCatch('Error en el servicio al generar token', 400)}

    // Se genera el request
    const response: RequestLogin = {
      response:{
        message: '¡Inicio de sesión exitoso! Bienvenido de nuevo.',
        deviceVerify: true, 
      },
      tokens:{
        TOKEN_ACCESS:tokenLogin.token,
        TOKEN_REFRESH:tokenRefresh.token,
      }
    };
    return response;
  }
  private async lg_sendCode_six (dataAuth:Auth, deviceAuth:DeviceAuth){
    // en el frot mandar a codigo de verificación
    // se envia nuevamente codigo por email
    const userData = await User.findByPk(dataAuth.IdUser)
    if(!userData){
      throw errorCatch('No se encontro usuario', 422)
    }

    const code_AutService = new CodeAutenticationService();
    const codeAuth = await code_AutService.createNewwCode({
      IdAuth: dataAuth.IdAuth,
      IdTypeCode: 6 //(6='Registro de dispositivo')
    });
    if(!codeAuth){
      throw errorCatch('No se genero código', 422)
    }

    const dataRefreshToken:TokenRefresh = { IdDeviceAuth: deviceAuth.IdDeviceAuth };
    const tokenValidCode = await this._generateToken(dataRefreshToken, 'Refresh', '30m'); 
    if(tokenValidCode.code != 200){throw errorCatch('Error en el servicio al generar token', 400)} 
    
    //se manda correo con codigo 
    const code = codeAuth.Code
    await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code||'');
    const response: RequestLogin = {
      response:{
        message: '¡Correo enviado con éxito! Hemos enviado otro código para verificar tu dispositivo.',
        deviceVerify: false, 
        TOKEN_ValidCode:tokenValidCode.token,                                
      },
      tokens:{}
    };
    return response;
  }
  private async lg_newDevice_LOGIN (deviceInfo:DevicesCreationAttributes, dataAuth:Auth, transaction:any){

    const IdAuth = dataAuth.IdAuth; 

    //Crear registro en tabla Device con token
    const device = await this._createDevice(deviceInfo, transaction)
    const deviceaAuth = await DeviceAuth.create({IdAuth, IdDevice:device.IdDevices}, { transaction });

    //se manda correo con codigo 
    const code_AutService = new CodeAutenticationService();
    const codeAuth = await code_AutService.createNewwCode({
      IdAuth: dataAuth.IdAuth,
      IdTypeCode: 6 //(6='Registro de dispositivo')
    });
    if(!codeAuth){
      throw errorCatch('No se genero código', 422)
    }
    const code = codeAuth.Code

    const userData = await User.findByPk(dataAuth.IdUser)
    if(!userData){
      throw errorCatch('No se encontro usuario', 422)
    }

    await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code||'');


    const deviceToken = uuidv4();          
    device.Token = deviceToken
    await this._updateDevice(device, transaction)

    const dataRefreshToken:TokenRefresh = { IdDeviceAuth: deviceaAuth.IdDeviceAuth };
    const tokenValidCode = await this._generateToken(dataRefreshToken, 'Refresh', '30m'); 
    if(tokenValidCode.code != 200){throw errorCatch('Error en el servicio al generar token', 400)} 

    const response: RequestLogin = {
      response: {
        message: '¡Correo enviado con éxito! Hemos enviado un código para verificar tu nuevo dispositivo.',
        deviceVerify: false, 
        TOKEN_DEVICE: deviceToken,          
        TOKEN_ValidCode: tokenValidCode.token,            
      }, 
      tokens:{
      }
    };
    return response;
  }
  protected async lg_validCodeDevice(Code:string, _paramsTokenRefresh:string):Promise<ServiceResponse<RequestLogin>>{
    try {

      if (!_paramsTokenRefresh) {
          throw errorCatch('El token del dispositivo es requerido pero no se proporcionó.', 422); 
      }

      const getToken = await this._varifyToken(_paramsTokenRefresh)
      const {IdDeviceAuth} = getToken.payload

      /**Se obtiene los datos del dispositivo */
      const deviceAuth = await DeviceAuth.findOne({
        where: {IdDeviceAuth}
      })
      if(!deviceAuth){
        throw errorCatch('Los datos del token no existen', 422)
      }
      const IdAuth=deviceAuth.IdAuth;
      const authData = await Auth.findByPk(IdAuth)    
      if(!authData){
        throw errorCatch('Los datos del token no existen', 422)
      }

      /**Se valida el codigó recibido */
      const code_AutService = new CodeAutenticationService();
      await code_AutService.validCode(Code, IdAuth);

      //* se crea un registro en tabla login con (IdAuth, IdDevice) con activo true  
      const login = await this._createLogin(IdAuth, deviceAuth.IdDeviceAuth)

      //* se genera un token con idUsuario y idUserPage   
      const userPage = await UserPage.findOne({where:{IdUser: authData.IdUser} });
      if(!userPage){
        throw errorCatch('No existe registro en la página de usuario', 422)
      }   

      /**Se genera los tokens */
      const dataRefreshToken:TokenRefresh = { IdDeviceAuth:deviceAuth.IdDevice };
      const expiracionDias = 30
      const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`); 
      if(tokenRefresh.code != 200){throw errorCatch('Error en el servicio al generar token', 400)} 

      const insertTokenRefresh = {
        IdRefreshToken: 0,
        Token: String(tokenRefresh.token),
        ExpiresAt: this.getfechaToken(expiracionDias),
        IsActive: true,
        IdAuth: IdAuth,
        IdDeviceAuth: deviceAuth.IdDeviceAuth,
      };
      const dataTokenRefresh = await this.createRefreshToken(insertTokenRefresh)
      const dataRefresh = {
        IdRefreshToken: dataTokenRefresh.IdRefreshToken,
        ExpiresAt: dataTokenRefresh.ExpiresAt || new Date(),
      }

      const dataAccessToken:TokenLogin = { IdAuth: IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
      const tokenLogin = await this._generateToken(dataAccessToken, 'Login');      
      if(tokenLogin.code != 200){throw errorCatch('Error en el servicio al generar token', 400)}
      
      const response: RequestLogin = {
        response:{
          message: '¡Dispositivo verificado con éxito! Ahora puedes acceder a tu cuenta de manera segura.',
          deviceVerify: true, 
        },
        tokens:{
          TOKEN_ACCESS:tokenLogin.token,
        }
      };  

      return {
        code: 200,
        isError: false,
        message: response
      };

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', err.statusCode);
    }

  }


  private getfechaToken (addDays:number){
    // Sumar días
    const fechaCon30Dias = new Date(Date.now() + addDays * 24 * 60 * 60 * 1000)
    return fechaCon30Dias
  } 
  private async _validParams(params: LoginParams, whithCode:boolean):Promise<Auth>{
    try {
      const {Username, Password} = params;

      const dataAuth = await Auth.findOne({where: {Username} })
      if(!dataAuth){
        throw errorCatch('Datos incorrectos ¡Intentelo nuevamente!', 422)
      }
      
      if(dataAuth.Status === 1){
        // Enviar correo con codeigo de verificacion de email
        throw errorCatch(`Codigo`, 422)
      }

      //verifica el status que este activo el user
      if(dataAuth.Status !== 2 && dataAuth.Status != 3){
        const status = await StatusAuth.findByPk(dataAuth.Status)
        throw errorCatch(`${status?.Description}`, 422)
      }

      if(!whithCode){
        const isPasswordValid =await bcrypt.compare(Password, dataAuth.Password);
        if (!isPasswordValid) {
          throw errorCatch('Datos incorrectos ¡Intentelo nuevamente!', 422)
        }
      } 
      return dataAuth
    } catch (err: any) {
      handleServiceError(err, 'validation', err.statusCode);
    }
  }
  private async _createDevice(deviceInfo:DevicesCreationAttributes, transaction: Transaction):Promise<Devices>{
    try {
      const devices = await Devices.create(deviceInfo, { transaction });
      return devices
    } catch (err: any) {
      handleServiceError(err, '_createDevice', err.statusCode);
    }
  }
  private async _updateDevice(deviceInfo:Devices,  transaction: Transaction):Promise<Devices>{
    try {
      const devices = await deviceInfo.update({ ...deviceInfo, Token:deviceInfo.Token}, { transaction });
      return devices
    } catch (err: any) {
      handleServiceError(err, '_updateDevice', err.statusCode);
    }
  }
  private async _createLogin(IdAuth: number, IdDeviceAuth:number, transaction?: Transaction):Promise<Login>{
    try {

      return await Login.create({
        IdAuth,
        IdDeviceAuth:IdDeviceAuth
      }, { transaction });
    } catch (err: any) {
      handleServiceError(err, '_createLogin', err.statusCode);
    }
  }
  private async _sendMailVerifyDevice(Email: string, Name:string,Firstname:string, Code:string ):Promise<any>{
    try {
      const mailConfig: MailServiceConfig = {
        accion:MailActions.NuevoDispositivo,
        to: Email,
        subject: 'Verificar nuevo dispositivo',
        dataMail: {
          name: Name,
          firstname: Firstname,
          code: Code,
        }
      };
      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();      
    } catch (err: any) {
      handleServiceError(err, '_sendMailVerifyDevice', err.statusCode);
    }
    
  }
  private async _updateLoginToInactive(IdDeviceAuth: number, IdAuth: number):Promise<void>{
    try {
      await Login.update({Active:false},{
        where:{IdAuth, IdDeviceAuth}
      }) 
    } catch (err: any) {
      handleServiceError(err, '_updateLoginToInactive', err.statusCode);
    }       
  }



  private async _generateToken(
    data: TokenLogin | TokenDevice | TokenRefresh,
    type: 'Login' | 'Device' | 'Refresh' | 'validCode',
    expirationTime: string = ''
  ): Promise<{ token?: string; message?: string; code: number }> {
    try {
      let contentToken: TokenPayload | null = null;
      // Validación y generación de contenido del token según el tipo
      switch (type) {
        case 'Login':
          contentToken = this._validateLoginData(data as TokenLogin);
          expirationTime = '1h';
          break;
  
        case 'Device':
          contentToken = this._validateDeviceData(data as TokenDevice);
          expirationTime = '30d';
          break;
  
        case 'Refresh':
          contentToken = this._validateRefreshData(data as TokenRefresh);          
          break;
        
        case 'validCode':
          contentToken = this._validateRefreshData(data as TokenRefresh);          
          break;
  
        default:
          return { message: 'Tipo de token no válido', code: 400 };
      }
  
      if (!contentToken) {
        return { message: 'No se pudo generar el contenido del token', code: 400 };
      }
  
      // Generamos el token
      const token = generateToken({
        dataToken: contentToken,
        expiresIn: expirationTime,
      });
  
      return { token, code: 200 };
    } catch (err: any) {
      // Manejo de errores
      handleServiceError(err, '_generateToken', err.statusCode || 500);
    }
  }
  private _validateLoginData(data: TokenLogin): TokenPayload | null {
    if (!data.IdAuth || !data.IdUserPage) {
      throw new Error('Faltan datos para generar el token de Login');
    }
    return {
      IdAuth: data.IdAuth,
      IdUserPage: data.IdUserPage,
    };
  }
  
  private _validateDeviceData(data: TokenDevice): TokenPayload | null {
    if (!data.IdDevice) {
      throw new Error('Faltan datos para generar el token de Dispositivo');
    }
    return { IdDevice: data.IdDevice };
  }
  
  private _validateRefreshData(data: TokenRefresh): TokenPayload | null {
    if (!data.IdDeviceAuth) {
      throw new Error('Faltan datos para generar el token de Refresh');
    }
    return { IdDevice: data.IdDeviceAuth };
  }
//#endregion ######################################### LOGIN


  //#region ######################################### CHANGE PASSWORD  
  protected async _recoveryPassword(Email: string): Promise<ServiceResponse<any>> {
    try {
      const user = await User.findOne({
        where: { Email } 
      });
      if (!user) {        
        return {
          code: 422,
          isError: true,
          message: `'Si existe una cuenta asociada con este correo, recibirás un email'`
        };    
      }

      const auth = await Auth.findOne({
        where:{IdUser: user.IdUser}
      })
      if(!auth){
        throw errorCatch('Usuario no autenticado', 422)
      }

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: auth.IdAuth,
        IdTypeCode: 3
      });

      const token = generateToken({
        dataToken: {
          IdUser: user.IdUser,
        },
        expiresIn: '30m',
      });

      // Envía el correo
      const mailConfig: MailServiceConfig = {
        accion:MailActions.RecoveryPassword,
        to: user.Email,
        subject: 'Solicitud de cambio de contraseña',
        dataMail:{
          name: user.Name,
          firstname: user.Firstname,
          token: token,
          code: codeAuth.Code ?? '',
        }
      };

      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();
      if(!responseMail.send) throw errorCatch(responseMail.response)        
      
      return {
        code: 200,
        isError: false,
        message: {
          token,
          data: {
            Name: user.Name,
            Firstname: user.Firstname
          },
          message:`¡Solicitud aprovada!, Accede al correo (${Email}) para seguir el proceso`
        }
      };
        
    } catch (err: any) {
      handleServiceError(err, '_recoveryPassword', err.statusCode);
    }
  } 
  protected async _validDataUser (token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(token)
      if(!response.valid){
        return {
          code: response.code,
          isError: true,
          message: response.message
        };
      }

      const {IdUser} = response.payload
      const authUser = await Auth.findOne({
        where: {IdUser}
      })
      if(!authUser) 
        throw errorCatch('No existe usuario autenticado', 422)
      
      if(authUser.Status != 2 && authUser.Status != 3){
        return {
          code: 422,
          isError: true,
          message: 'El estatus de usuario no se encuentra en condiciones para solicitar el cambio de contraseña'
        };
      }

      return {
        code: 200,
        isError: false,
        message: 'Solicitud aprovada'
      };

    } catch (err: any) {
      handleServiceError(err, '_validDataUser', err.statusCode);
    }
  } 
  protected async _changePassword (Password: string, Token:string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)
      if(!response.valid){
        return {
          code: response.code,
          isError: true,
          message: response.message
        };
      }

      const {IdUser} = response.payload
      
      const userService = new UserService()
      const userData = await userService.findByPkUser_forAuth(IdUser)
      if (!userData) {
        return {
          code: 422,
          isError: true,
          message: `Si existe una cuenta asociada con este correo, recibirás un email`
        };
      }

      const authUser = await Auth.findOne({
        where: {IdUser}
      })
      if (!authUser) {
        throw errorCatch('Usuario no se relaciona con la autenticación', 422)
      }
      
      const hashedPassword = await bcrypt.hash(Password, 10);
      authUser.Password = hashedPassword
      authUser.Pw = Password

      await authUser.save()

      // Envía el correo
      const mailConfig: MailServiceConfig = {
        accion:MailActions.PasswordChangeSuccessful,
        to: userData.Email,
        subject: 'Confirmación de cambio de contraseña',
        dataMail:{
          name: userData.Name,
          firstname: userData.Firstname
        }
      };
      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();
      if(!responseMail.send) throw errorCatch(responseMail.response) 

      return {
        code: 200,
        isError: false,
        message: '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña'
      };
      

    } catch (err: any) {
      handleServiceError(err, '_changePassword', err.statusCode);
    }

  }

  protected async _validCode (Code: string, Token:string): Promise<ServiceResponse<any>>{
    try {
      const response = await this._varifyToken(Token)
  
      if(!response.valid){
        return {
          code: response.code,
          isError: true,
          message: response.message
        };
      }
  
      const {IdUser} = response.payload
  
      if(!IdUser){
        return {
          code: 422,
          isError: true,
          message: `Los datos del Token son invalido`
        };
      }
  
      const userService = new UserService()
      const userData = await userService.findByPkUser_forAuth(IdUser)
      if (!userData) {
        return {
          code: 422,
          isError: true,
          message: `Usuario no se encuentra`
        };
      }
  
      const authData = await Auth.findOne({
        where:{IdUser: userData.IdUser}
      })
      if(!authData){
        throw errorCatch('Usuario no se relaciona con la autenticación', 422)
      }
  
      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if(dataCode == 0){
        return {
          code: 422,
          isError: true,
          message: 'El Cóodigo incorrecto',
        };
      }
  
      const token = generateToken({
        dataToken: {
          IdUser: userData.IdUser,
        },
        expiresIn: '30m',
      });
  
  
  
      return {
        code: 200,
        isError: false,
        message: {
          token,
          message: `¡Código correcto! Puedes cambiar tu contraseña`
        }
      };
      
    } catch (err: any) {
      handleServiceError(err, '_validCode', err.statusCode);
    }
  }
//#endregion ######################################### CHANGE PASSWORD


//#region ######################################### TOKEN
  /** 
   * Flujos de Solicitud del Cliente
      Inicio de sesión:
      El servidor devuelve ambos tokens.
      El cliente usa el access token para llamadas a rutas protegidas.
      El refresh token se guarda de manera segura (cookie HTTP-only).
      
      Cuando el Access Token Expira:
      El cliente detecta un error 401 o 403 al usar el access token.
      Solicita un nuevo access token enviando el refresh token al servidor.
      El servidor devuelve un nuevo access token (si el refresh token es válido).
      
      Cierre de sesión:
      El cliente envía el refresh token para invalidarlo en el servidor.
   */
    /**
    3. Opciones avanzadas
    Si quieres mejorar la experiencia del usuario, puedes implementar un flujo adicional:
    Notificar al cliente antes de la expiración
    Incluye en la respuesta del Access Token o en un endpoint dedicado información sobre la proximidad de expiración del Refresh Token, 
    para que el cliente pueda actuar antes de que expire.
    Renovación automática (si es seguro):
    Si el Refresh Token está a punto de expirar (pero no ha expirado), permite al cliente renovar el Refresh Token generando uno 
    nuevo sin necesidad de forzar el inicio de sesión.
  */
  private async createRefreshToken({ Token, ExpiresAt, IsActive = true, IdAuth, IdDeviceAuth, LastUsedAt}: RefreshTokenAttributes, transaction?: Transaction): Promise<RefreshToken> {
      try {
        const refreshToken = await RefreshToken.create({
          Token,
          ExpiresAt,
          IsActive,
          IdAuth,
          IdDeviceAuth,
          LastUsedAt
        }, {transaction});

        return refreshToken;
      } catch (err: any) {
        handleServiceError(err, 'Could not create refresh token', err.statusCode);
      }
  }

  private async _varifyToken (token:string): Promise<any>{
    try {
      const response = await verifyToken(token)
      if(!response.valid) return response
        // throw errorCatch(response.message, response.cade)
      
      if(!this._HasPayload_Private(response))
        return response

      return response
    } catch (err: any) {
      handleServiceError(err, '_varifyToken', err.statusCode);
    }
  }
  /** 
   * @param response 
   * @returns 
   */
  private _HasPayload_Private(response: { payload?: TokenPayload }): response is { payload: TokenPayload } {
    return response.payload !== undefined;
  }
//#endregion ######################################### TOKEN


  protected async _findByUsername(Username: string): Promise<Auth | null> {
    try {
      const record = await Auth.findOne({
        where: { Username } // Busca donde el campo 'username' coincida
      });
      return record;
    } catch (err: any) {
      handleServiceError(err, '_findByUsername', err.statusCode);
    }
  }

}

