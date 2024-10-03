import { Transaction, where } from 'sequelize';
const bcrypt = require("bcrypt");
import error from '../../middlewares/error';
import { withTransaction } from '../../Utils/transaction_helper';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { generateToken, verifyToken, TokenPayload, TokenLogin, TokenDevice} from '../Secure/tokenJWT';
import { MailActions, MailServiceConfig, MailService } from '../Secure/mails/sendMail';

import { Auth, AuthCreationAttributes } from '../models/auth'; 
import { CodeAutentication } from '../models/code-autentication';
import { User } from '../models/user';
import { StatusAuth } from '../models/status-auth';
import { Login } from '../models/login';
import { Devices, DevicesCreationAttributes } from '../models/devices';
import { UserPage } from '../models/user-page';

import { CodeAutenticationService } from './code_autentication.service';
import { UserService } from './user.service';
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

      const auth = await this._createAuth(authData, transaction);

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createCodeEmail({
        IdAuth: auth.IdAuth,
        IdTypeCode: 1
      }, transaction);

      return {
        auth,
        codeAuth,
      };

    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }  
  protected async _generateCodeEmail(Email:string): Promise<any>{
    try {
      
      const userData = await User.findOne({
        where: {Email}
      })    
      if(!userData){
        throw error('El correo es incorrecto', 409)
      }

      const auth = await Auth.findOne({
        where:{IdUser: userData.IdUser}
      })
      if(!auth){
        throw error('El usuario no se encuentra',409)
      }

      if(auth.Status == 2){
        throw error('La cuenta ya se encuentra activa', 500)
      }

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createCodeEmail({
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

      return '¡Código generado! Te llegará a tu correo electrónico.'

    } catch (err: any) {
      throw error(`${err.message}`)
    }
  }  
  private async _createAuth(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }
  
  protected async _validCodeByEmail (Email:string, Code: string): Promise<any> {
    try {
      const userData = await User.findOne({
        where: {Email}
      })    
      if(!userData){
        throw error('El correo es incorrecto', 409)
      }
    
      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCodeEmail(Code);

      await Auth.update({Status: 2}, {
        where: {
          IdAuth: dataCode.IdAuth 
        }
      });

      return 'Código valido, ya puedes inicia sesion'
    } catch (err: any) {
      throw error(`${err.message}`)
    }
  }
  //#endregion ######################################### CREATION ACOUNT


  //#region ######################################### LOGIN
  protected async _login(params: ParamsLogin): Promise<any> {
    return await withTransaction(async (transaction)=>{
      try {
        const {withToken, deviceToken, deviceInfo} = params
        
        //Valida parametros
        const dataAuth = await this._validParams(params.Login);
        
        if(!dataAuth){
          error('dataAuth es null o undefined')
        }

        //obtiene lista de login
        const IdAuth = dataAuth.IdAuth;        
        // const listLogin = await Login.findAll({
        //   where: { IdAuth }
        // });
        const listLogin = await Login.findAll();

        //VALIDA LOGIN Y TOKEN
        if(listLogin.length === 0){ //########### PRIMER LOGIN
          if (!deviceInfo) {
            throw error('El token del dispositivo es requerido pero no se proporcionó.', 400); 
          }

          //* Crear registro en tabla Device con token
          const device = await this._createDevice(deviceInfo, transaction)
          //* se crea un registro en tabla Login con (IdAuth, IdDevice) con activo true 
          const login = await this._createLogin(dataAuth.IdAuth, device.IdDevices, transaction)

          const userPage = await UserPage.findOne({where:{IdUser: dataAuth.IdUser} });
          if(!userPage){
            throw error('No existe registro en tabla userPage')
          }

          const tokenLogin = await this._generateToken({ IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage }, 'Login');
          const tokenDevice = await this._generateToken({ IdDevice: device.IdDevices, IdAuth: dataAuth.IdAuth, IdUser: dataAuth.IdUser }, 'Device');
          
          return {
            message: '¡Inicio de sesión exitoso! Bienvenido.',
            tokenDevice,
            tokenLogin
          }

        } else if(listLogin.length >= 1){  //########### MÁS DE UN LOGUEO

          if(!withToken){  //########### NO EXISTE TOKEN VALIDAR Dispositivo (NUEVO DISPOSITIVO)
            if (!deviceInfo) {
              throw error('El token del dispositivo es requerido pero no se proporcionó.', 400); 
            }
            //Crear registro en tabla Device con token
            const device = await this._createDevice(deviceInfo, transaction)
            //se manda correo con codigo 
            const code_AutService = new CodeAutenticationService();
            const codeAuth = await code_AutService.createCodeEmail({
              IdAuth: dataAuth.IdAuth,
              IdTypeCode: 6
            });

            await this._sendMailVerifyDevice('', '', '', '');

            const tokenDevice = await this._generateToken({ IdDevice: device.IdDevices, IdAuth: dataAuth.IdAuth, IdUser: dataAuth.IdUser }, 'Device');
            return {
              message: '¡Correo enviado con éxito! Hemos enviado un código para verificar tu nuevo dispositivo.',
              tokenDevice
            }
 
          }else if(withToken){  //########### EXISTE TOKEN del Dispositivo 

            if (!deviceToken) {
                throw error('El token del dispositivo es requerido pero no se proporcionó.', 400); 
            }

            const response = await this._varifyToken(deviceToken)
            const {IdDevice} = response.payload

            //* Actualiza en tabla login todos los registros en el campo activo=false donde el idDevice sea el del token
            await this._updateLoginToInactive(IdDevice)
            //* se crea un registro en tabla login con (IdAuth, IdDevice) con activo true
            const login = await this._createLogin(dataAuth.IdAuth, IdDevice, transaction)
            //* se genera un token con idUsuario y idUserPage
            const userPage = await UserPage.findOne({where:{IdUser: dataAuth.IdUser} });
            if(!userPage){
              throw error('No existe registro en tabla userPage')
            }
            const tokenLogin = await this._generateToken({ IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage }, 'Login');
            return {
              message: '¡Inicio de sesión exitoso! Bienvenido de nuevo.',
              tokenLogin
            }
          }

        } 

      } catch (err: any) {
        throw error(`${err.message}`)
      }

    })      
  }
  private async _validParams(params: LoginParams):Promise<Auth>{
    try {
      const {Username, Password} = params;

      const dataAuth = await Auth.findOne({where: {Username} })
      if(!dataAuth){
        throw error('Datos incorrectos ¡Intentelo nuevamente!', 409)
      }
      
      if(dataAuth.Status !== 2){
        const status = await StatusAuth.findByPk(dataAuth.Status)
        throw error(`${status?.Description}`)
      }

      const isPasswordValid =await bcrypt.compare(Password, dataAuth.Password);
      if (!isPasswordValid) {
        throw error('Datos incorrectos ¡Intentelo nuevamente!', 409)
      }

      return dataAuth
    } catch (err: any) {
      throw error(`${err.message}`)
    }
  }

  private async _createDevice(deviceInfo:DevicesCreationAttributes,  transaction: Transaction):Promise<Devices>{
    try {
      return await Devices.create(deviceInfo, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error Creando Device', 500)
    }
  }

  private async _createLogin(IdAuth: number, IdDevice:number, transaction?: Transaction):Promise<Login>{
    try {

      return await Login.create({
        IdAuth,
        IdDevice
      }, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error Creando Device', 500)
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
                  throw error('Faltan datos para generar el token de Login');
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
                  throw error('Faltan datos para generar el token de Dispositivo');
              }
              contentToken = {
                  IdDevice: deviceData.IdDevice,
                  IdAuth: deviceData.IdAuth,
                  IdUser: deviceData.IdUser,
              };
              break;
  
          default:
              throw error('Tipo de token no válido');
      }
  
      // Generamos el token utilizando la función `generateToken`
      const token = generateToken({
          dataToken: contentToken,
          expiresIn: '30m', // o el tiempo que sea apropiado para tu caso
      });
  
      return token;
      
    } catch (err: any) {
      throw error(`${err.message}`) 
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
      throw error(`${err.message}`) 
    }
    
  }

  private async _updateLoginToInactive(IdDevice: number):Promise<void>{
    try {
      await Login.update({Active:false},{
        where:{IdDevice}
      }) 
    } catch (err: any) {
      throw error(`${err.message}`)
    }
       
  }

  protected async _validCodeDevice(Email:string, Code:string, deviceToken:string):Promise<any>{
    try {

      if (!deviceToken) {
          throw error('El token del dispositivo es requerido pero no se proporcionó.', 400); 
      }

      const response = await this._varifyToken(deviceToken)
      const {IdDevice, IdUser, IdAuth} = response.payload


      const userData = await User.findOne({
        where: {Email}
      })    
      if(!userData){
        throw error('El correo es incorrecto', 409)
      }
    
      const code_AutService = new CodeAutenticationService();
      await code_AutService.validCodeEmail(Code);

      //* se crea un registro en tabla login con (IdAuth, IdDevice) con activo true  
      this._createLogin(IdAuth, IdDevice)

      //* se genera un token con idUsuario y idUserPage   
      const userPage = await UserPage.findOne({where:{IdUser: IdUser} });
      if(!userPage){
        throw error('No existe registro en tabla userPage')
      }   
      const tokenLogin = await this._generateToken({ IdAuth: IdAuth, IdUserPage: userPage.IdUserPage }, 'Login');
      return{
        message: '¡Dispositivo verificado con éxito! Ahora puedes acceder a tu cuenta de manera segura.',
        tokenLogin
      }
    } catch (err: any) {
      throw error(`${err.message}`)
    }


    return ''
  }
  //#endregion ######################################### LOGIN


  //#region ######################################### CHANGE PASSWORD  
  protected async _recoveryPassword(Email: string): Promise<string> {
    try {
      const user = await User.findOne({
        where: { Email } 
      });
      if (!user) {
        throw error('Si existe una cuenta asociada con este correo, recibirás un email', 409)        
      }

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
          token: token
        }
      };

      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();
      if(!responseMail.send) throw error(responseMail.response)        
      
      return `¡Solicitud aprovada!, Accede al correo (${Email}) para seguir el proceso`;

    } catch (err: any) {
      throw error(`${err.message}`)
    }
  } 
  protected async _validDataUser (token: string): Promise<any> {
    try {
      const response = await this._varifyToken(token)

      const {IdUser} = response.payload
      const authUser = await Auth.findOne({
        where: {IdUser}
      })

      if(!authUser) 
        throw error('No existe usuario', 404)
      
      if(authUser.Status != 2 && authUser.Status != 3)
        throw error('El estatus de usuario no se encuentra en condiciones para solicitar el cambio de contraseña', 409)

      return 'Solicitud aprovada';

    } catch (err: any) {
      throw error(`${err.message}`)
    }
  } 
  protected async _changePassword (Password: string, Token:string): Promise<any> {
    try {
      const response = await this._varifyToken(Token)
      const {IdUser} = response.payload
      

      const userService = new UserService()
      const userData = await userService.findByPkUser(IdUser)
      if (!userData) {
        throw error(`Si existe una cuenta asociada con este correo, recibirás un email`);
      }

      const authUser = await Auth.findOne({
        where: {IdUser}
      })
      if (!authUser) {
        throw error('No existe usuario', 404)
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
      if(!responseMail.send) throw error(responseMail.response) 
      
      
      return '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña';

    } catch (err: any) {
      throw error(`${err.message}`, 409)
    }

  }
//#endregion ######################################### CHANGE PASSWORD


//#region ######################################### TOKEN
  private async _varifyToken (token:string): Promise<any>{
    try {
      const response = await verifyToken(token)
      if(!response.valid)
        throw error(response.message, response.cade)
      
      if(!this._HasPayload_Private(response))
        throw error(response.message, response.cade)

      return response
    } catch (err: any) {
      throw error(err.message, 409)      
    }
  }
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
    } catch (err) {
      throw error(`Error obteniendo el registro con USERNAME ${Username}: ${err}`);
    }
  }
}

