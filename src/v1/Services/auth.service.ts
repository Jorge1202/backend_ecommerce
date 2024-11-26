import { Transaction, where } from 'sequelize';
const bcrypt = require("bcrypt");
import { errorCatch } from '../../middlewares/error';
import { withTransaction } from '../../Utils/transaction_helper';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { generateToken, verifyToken, TokenPayload, TokenLogin, TokenDevice} from '../Secure/tokenJWT';
import { MailActions, MailServiceConfig, MailService } from '../Secure/mails/sendMail';

import { Auth, AuthCreationAttributes } from '../models/auth'; 
import { CodeAutentication } from '../models/code-autentication';
import { User } from '../models/user';
import { UserPage } from '../models/user-page';
import { StatusAuth } from '../models/status-auth';
import { Login } from '../models/login';
import { Devices, DevicesCreationAttributes } from '../models/devices';

import { CodeAutenticationService } from './code_autentication.service';
import { UserService } from './user.service';
import { ServiceResponse } from '../../Utils/ServiceResponse';

interface RequestLogin {
  message:string
  deviceVerify: boolean
  tokenDevice?: string
  tokenLogin?: string
}

interface AuthResult {
  auth: Auth; // Asumiendo que 'Auth' es el tipo que devuelve 'createAuth'
  codeAuth: CodeAutentication; // Asumiendo que 'CodeAuthentication' es el tipo que devuelve '_createCodeAuthentication'
}

interface LoginParams {
  Username: string;
  Password: string;
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
      const { Username: Email, Password: Code } = _Login; //Cambio de nombre de variables
 
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
        //verifica el status que este activo el user
        if(dataAuth.Status != 2 && dataAuth.Status != 3){
          throw errorCatch('Error al iniciar sesión', 422)
        }

        //obtiene lista de login
        const IdAuth = dataAuth.IdAuth;        
        const listLogin = await Login.findAll({
          where: { IdAuth }
        });
        

        //VALIDA LOGIN Y TOKEN
        if(listLogin.length === 0){ //########### PRIMER LOGIN
          if (!deviceInfo) {
            throw errorCatch('Los datos del dispositivo no se encuentran.', 422); 
          }

          //* Crear registro en tabla Device con token
          const device = await this._createDevice(deviceInfo, transaction)
          //* se crea un registro en tabla Login con (IdAuth, IdDevice) con activo true 
          const login = await this._createLogin(dataAuth.IdAuth, device.IdDevices, transaction)

          const userPage = await UserPage.findOne({where:{IdUser: dataAuth.IdUser} });
          if(!userPage){
            throw errorCatch('No existe registro en tabla userPage', 422)
          }

          const tokenLogin = await this._generateToken({ IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin }, 'Login');
          const tokenDevice = await this._generateToken({ IdDevice: device.IdDevices, IdAuth: dataAuth.IdAuth, IdUser: dataAuth.IdUser }, 'Device');
          
          device.Token = tokenDevice
          await this._updateDevice(device, transaction)

          const response: RequestLogin = {            
            message: '¡Inicio de sesión exitoso! Bienvenido.',
            deviceVerify: true, 
            tokenDevice,
            tokenLogin
          };

          return response;
       

        } 
        else if(listLogin.length >= 1){  //########### MÁS DE UN LOGUEO

          if(!withToken){  //########### NO EXISTE TOKEN VALIDAR Dispositivo (NUEVO DISPOSITIVO)
            if (!deviceInfo) {
              throw errorCatch('La información del dispositivo es requerida pero no se proporcionó.', 422); 
            }
            //Crear registro en tabla Device con token
            const device = await this._createDevice(deviceInfo, transaction)
            //se manda correo con codigo 
            const code_AutService = new CodeAutenticationService();
            const codeAuth = await code_AutService.createNewwCode({
              IdAuth: dataAuth.IdAuth,
              IdTypeCode: 6
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

            const tokenDevice = await this._generateToken({ IdDevice: device.IdDevices, IdAuth: dataAuth.IdAuth, IdUser: dataAuth.IdUser }, 'Device');
            device.Token = tokenDevice
            await this._updateDevice(device, transaction)
            
            const response: RequestLogin = {
              message: '¡Correo enviado con éxito! Hemos enviado un código para verificar tu nuevo dispositivo.',
              deviceVerify: false, 
              tokenDevice,
            };
            return response;
 
          }          
          else if(withToken){  //########### EXISTE TOKEN del Dispositivo 

            // Validar si no tiene codigos pendientes que verificar en esttus 6
            const dataActivo = await CodeAutentication.findOne({
              where:{
                IdAuth:dataAuth.IdAuth,
                IsActive: true
              }
            })

            if(dataActivo){
              throw errorCatch('Por favor, ingresa el código de verificación para completar el inicio de sesión.', 422)
            }

            if (!deviceToken) {
                throw errorCatch('El token del dispositivo es requerido pero no se proporcionó.', 422); 
            }


            const getToken = await this._varifyToken(deviceToken)
            const {IdDevice, IdAuth, IdLogin} = getToken.payload

          
            //* Actualiza en tabla login todos los registros en el campo activo=false donde el idDevice sea el del token
            await this._updateLoginToInactive(IdDevice)
            //* se crea un registro en tabla login con (IdAuth, IdDevice) con activo true
            const login = await this._createLogin(dataAuth.IdAuth, IdDevice, transaction)
            //* se genera un token con idUsuario y idUserPage
            const userPage = await UserPage.findOne({where:{IdUser: dataAuth.IdUser} });
            if(!userPage){
              throw errorCatch('No existe registro en tabla userPage', 422)
            }
            const tokenLogin = await this._generateToken({ IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin }, 'Login');

            const response: RequestLogin = {
              message: '¡Inicio de sesión exitoso! Bienvenido de nuevo.',
              deviceVerify: true, 
              tokenLogin,
            };
            return response;

          }
        } 

      } catch (err: any) {
        handleServiceError(err, 'withTransaction', err.statusCode);
      }

    })      
  }
  private async _validParams(params: LoginParams, whithCode:boolean):Promise<Auth>{
    try {
      const {Username, Password} = params;

      const dataAuth = await Auth.findOne({where: {Username} })
      if(!dataAuth){
        throw errorCatch('Datos incorrectos ¡Intentelo nuevamente!', 422)
      }
      
      if(dataAuth.Status !== 2){
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
      handleServiceError(err, '_validParams', err.statusCode);
    }
  }

  private async _createDevice(deviceInfo:DevicesCreationAttributes,  transaction: Transaction):Promise<Devices>{
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

  private async _createLogin(IdAuth: number, IdDevice:number, transaction?: Transaction):Promise<Login>{
    try {

      return await Login.create({
        IdAuth,
        IdDevice
      }, { transaction });
    } catch (err: any) {
      handleServiceError(err, '_createLogin', err.statusCode);
    }
  }

  private async _generateToken(data: TokenLogin | TokenDevice, type: 'Login' | 'Device'): Promise<string> {
    try {
      let contentToken: TokenPayload;
  
      switch (type) {
          case 'Login':
              // Aseguramos que `data` es de tipo `TokenLogin`
              const loginData = data as TokenLogin;
              if (!loginData.IdAuth || !loginData.IdUserPage) {
                  throw errorCatch('Faltan datos para generar el token de Login', 400);
              }
              contentToken = {
                  IdAuth: loginData.IdAuth,
                  IdUserPage: loginData.IdUserPage,
              };
              break;
  
          case 'Device':
              // Aseguramos que `data` es de tipo `TokenDevice`
              const deviceData = data as TokenDevice;
              if (!deviceData.IdAuth || !deviceData.IdDevice || !deviceData.IdUser) {
                  throw errorCatch('Faltan datos para generar el token de Dispositivo', 400);
              }
              contentToken = {
                  IdDevice: deviceData.IdDevice,
                  IdAuth: deviceData.IdAuth,
                  IdUser: deviceData.IdUser,
              };
              break;
            
          default:
              throw errorCatch('Tipo de token no válido', 400);
      }
  
      // Generamos el token utilizando la función `generateToken`
      const token = generateToken({
          dataToken: contentToken,
          expiresIn: '7d', // o el tiempo que sea apropiado para tu caso
      });
  
      return token;
      
    } catch (err: any) {
      handleServiceError(err, '_generateToken', err.statusCode);
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

  private async _updateLoginToInactive(IdDevice: number):Promise<void>{
    try {
      await Login.update({Active:false},{
        where:{IdDevice}
      }) 
    } catch (err: any) {
      handleServiceError(err, '_updateLoginToInactive', err.statusCode);
    }
       
  }

  protected async _validCodeDevice(Code:string, deviceToken:string):Promise<ServiceResponse<RequestLogin>>{
    try {

      if (!deviceToken) {
          throw errorCatch('El token del dispositivo es requerido pero no se proporcionó.', 422); 
      }

      const getToken = await this._varifyToken(deviceToken)
      const {IdDevice, IdUser, IdAuth} = getToken.payload

      const userData = await User.findByPk(IdUser)    
      if(!userData){
        throw errorCatch('El correo es incorrecto', 422)
      }
    
      const code_AutService = new CodeAutenticationService();
      await code_AutService.validCode(Code, IdAuth);

      //* se crea un registro en tabla login con (IdAuth, IdDevice) con activo true  
      const login = await this._createLogin(IdAuth, IdDevice)

      //* se genera un token con idUsuario y idUserPage   
      const userPage = await UserPage.findOne({where:{IdUser: IdUser} });
      if(!userPage){
        throw errorCatch('No existe registro en tabla userPage', 422)
      }   
      const tokenLogin = await this._generateToken({ IdAuth: IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin }, 'Login');

      const response: RequestLogin = {
        message: '¡Dispositivo verificado con éxito! Ahora puedes acceder a tu cuenta de manera segura.',
        deviceVerify: true, 
        tokenLogin,
      };

      return {
        code: 200,
        isError: false,
        message: response
      };

    } catch (err: any) {
      handleServiceError(err, '_validCodeDevice', err.statusCode);
    }

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

  private async refreshToken (){
    
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

