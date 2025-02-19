import { Transaction, where } from 'sequelize';
const bcrypt = require("bcrypt");
import { withTransaction } from '../../Database/transaction_helper';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { generateToken, verifyToken } from '../../Secure/tokenJWT';
import { TokenPayload, TokenLogin, TokenDevice, TokenRefresh, Token_New_Device } from '../../Secure/interfaceToken';
import { MailActions, MailServiceConfig, MailService } from '../../Mails/sendMail';

import { Auth, AuthCreationAttributes } from '../models/auth';
import { CodeAutentication } from '../models/code-autentication';
import { User } from '../models/user';
import { UserPage } from '../models/user-page';
import { StatusAuth } from '../models/status-auth';
import { Login } from '../models/login';
import { Devices, DevicesCreationAttributes } from '../models/devices';
import { DeviceAuth } from '../models/device-auth';
import { RefreshToken, RefreshTokenAttributes } from '../models/refresh-token';

import { CodeAutenticationService } from './code_autentication.service';
import { UserService } from './user.service';
import { ServiceResult, errorResult, successResult, throwServerError } from '../../Utils/Response/ServiceResult';

import { maskEmail } from '../../Mails/maskEmail';

const { v4: uuidv4 } = require('uuid');



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
  //#region
  protected async _methodPruebaErrores(dataAuth:number): Promise<ServiceResult<any>> {
    try {
      if (dataAuth==1) {
        throw throwServerError({
          message: 'Error crítico para el flujo.',
          status: 409,
        });

        
      }
      if (dataAuth==2) {
        return errorResult({
          status: 400,
          message: `Error de sintaxis o datos incompletos o inválidos`
        });
      }
      
      return successResult({
        status: 200,
        message: 'Bienvenido',
        body: dataAuth
      });

    }  catch (err: any) {
      handleServiceError(err, '_methodPrueba', 'AuthService');
    }

  }
  //#endregion


  //#region ######################################### CREATION ACOUNT
  public async createAuth(authData: AuthCreationAttributes, transaction: Transaction): Promise<ServiceResult<AuthResult>> {
    try {

      const hashedPassword = await bcrypt.hash(authData.Password, 10);
      authData = { ...authData, Password: hashedPassword }

      const auth = await this.createAuth_Private(authData, transaction);

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: auth.IdAuth,
        IdTypeCode: 1
      }, transaction);

      if (!codeAuth || !auth) {
        throw throwServerError({
          message: 'Error al crear el registro',
          status: 500,
        });
      }

      return successResult({
        status: 200,
        message: 'Se ha creado el registro',
        body:{
          auth,
          codeAuth,
        }
      });

    } catch (error: any) {
      handleServiceError(error, 'createAuth', 'AuthService')
    }
  }
  protected async _generateCodeEmail(Email: string): Promise<ServiceResult<any>> {
    try {

      const userData = await User.findOne({
        where: { Email }
      })
      if (!userData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const auth = await Auth.findOne({
        where: { IdUser: userData.IdUser }
      })
      if (!auth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      if (auth.Status == 2) {
        return errorResult({
          status: 422,
          message: 'La cuenta ya se encuentra activa'
        });
      }

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: auth.IdAuth,
        IdTypeCode: 1
      });

      const mailConfig: MailServiceConfig = {
        accion: MailActions.CodeAuth,
        to: Email,
        subject: 'Verificar cuenta',
        dataMail: {
          name: userData.Name,
          firstname: userData.Firstname,
          code: codeAuth.Code ?? '',
        }
      };
      const mailService = new MailService(mailConfig);
      const {send, response} = await mailService.send();
      if(!send){
        console.error('mailService.send()', response);     
      }



      return successResult({
        status: 200,
        message: '¡Código generado! Te llegará a tu correo electrónico.',
      });

    } catch (error: any) {
      handleServiceError(error, '_generateCodeEmail', 'AuthService')
    }
  }
  protected async _validCodeByEmail(Token: string, Code: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdAuth } = response.payload
      if (!IdAuth) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const authData = await Auth.findOne({
        where: { IdAuth }
      })
      if (!authData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const userData = await User.findOne({
        where: { IdUser: authData.IdUser }
      })
      if (!userData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if (dataCode == 0) {
        return errorResult({
          message: 'El Cóodigo es incorrecto',
          status: 422,
        });
      }

      authData.Status = 2; //status de auth queda activo=2
      authData.save();

      // 6. Crea code para Iniciar sesión  Tipo=5
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: authData.IdAuth,
        IdTypeCode: 5
      });
      return successResult({
        message: 'El Cóodigo generado',
        status: 200,
        body: {
          Email: userData.Email,
          Code: codeAuth.Code
        }
      });

    } catch (error: any) {
      handleServiceError(error, '_validCodeByEmail', 'AuthService')
    }
  }
  protected async _validViewVerifyEmail(Token: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdAuth } = response.payload
      if (!IdAuth) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      //Validar si cuenta con un code estatus 3
      const IdTypeCode = 3;
      const codeValid = await CodeAutentication.findOne({
        where: { IdTypeCode, IdAuth: IdAuth }
      });
      if (!codeValid) {
        return errorResult({
          status: 422,
          message: 'No cuenta con solicitud de verificacion de correo'
        });
      }

      return successResult({
        status: 200,
        message: 'Vista autorizada'
      });

    } catch (error: any) {
      handleServiceError(error, '_validCodeByEmail', 'AuthService')
    }
  }
  protected async _reSendCode(Token: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdAuth } = response.payload
      if (!IdAuth) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const auth = await Auth.findOne({
        where: { IdAuth }
      })
      if (!auth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const IdTypeCode = 3;
      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: IdAuth,
        IdTypeCode
      });

      const user = await User.findOne({
        where: { IdUser: auth.IdUser }
      })
      if (!user) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
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
      const {send, response:message} = await mailService.send();
      if(!send){
        console.error('mailService.send()', message);     
      }


      return successResult({
        status: 200,
        message: 'Se ha enviado correo con nuevo código'
      });
    } catch (err: any) {
      handleServiceError(err, '_reSendCode', 'AuthService');
    }
  }
  private async createAuth_Private(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error: any) {
      handleServiceError(error, '_createAuth', 'AuthService')
    }
  }
  //#endregion ######################################### CREATION ACOUNT


  //#region ######################################### LOGIN
  protected async loginAfterRegister(params: ParamsLogin): Promise<ServiceResult<any>> {
    try {
      const { Login } = params
      const _Login: LoginParams = Login
      const { Username: Email, Code } = _Login; //Cambio de nombre de variables

      const user = await User.findOne({
        where: { Email }
      });
      if (!user) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const authData = await Auth.findOne({
        where: { IdUser: user.IdUser }
      });
      if (!authData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const codeValid = await CodeAutentication.findOne({
        where: { Code, IdAuth: authData.IdAuth }
      });
      if (!codeValid) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      if (!codeValid.IsActive) {
        return errorResult({
          status: 422,
          message: 'Tu código ha expirado'
        });
      }

      await codeValid.update({ IsActive: false })

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
      return successResult({
        status: 200,
        message: 'Se genero login',
        body: responseLogin
      });

    } catch (err: any) {
      handleServiceError(err, 'loginAfterRegister', 'AuthService');
    }
  }
  protected async _login(params: ParamsLogin, whithCode: boolean = false): Promise<ServiceResult<any>> {
    return await this._login_pv(params, whithCode)
  }
  private async fc_validParams_login(params: LoginParams, whithCode: boolean): Promise<ServiceResult<any>> {
    try {
      const { Username, Password } = params;

      const dataAuth = await Auth.findOne({ where: { Username } })
      if (!dataAuth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      if (dataAuth.Status === 1) {
        // --- Enviar correo con codigo de verificacion de email

        return errorResult({
          status: 422,
          message: `Confirma tu correo electrónico, mediante el código de verificación`
        });
      }

      //verifica el status que este activo el user
      if (dataAuth.Status !== 2 && dataAuth.Status != 3) {
        const status = await StatusAuth.findByPk(dataAuth.Status)
        return errorResult({
          status: 422,
          message: `${status?.Description}`
        });
      }

      if (!whithCode) {
        const isPasswordValid = await bcrypt.compare(Password, dataAuth.Password);
        if (!isPasswordValid) {
          throw throwServerError({
            status: 409,
            message: 'No cuentas con permisos para hacer login'
          });
        }
      }

      return successResult({
        status: 200,
        message: 'Bienvenido',
        body: dataAuth
      });

    } catch (err: any) {
      handleServiceError(err, 'validation', 'AuthService');
    }
  }
  private async _login_pv (params: ParamsLogin, whithCode: boolean = false): Promise<any>{
    return await withTransaction(async (transaction) => {
      try {
        const { withToken, deviceToken, deviceInfo } = params

        //Valida parametros
        const infoAuth = await this.fc_validParams_login(params.Login, whithCode);
        if (infoAuth.status !== 200) {
          return errorResult({
            status: infoAuth.status,
            message: infoAuth.message
          });
        }

        //obtiene lista de login
        const { body } = infoAuth
        const IdAuth = body.IdAuth;
        const listLogin = await Login.findAll({
          where: { IdAuth }
        });


        //########### PRIMER LOGIN VALIDA LOGIN Y TOKEN
        if (listLogin.length === 0) {
          if (!deviceInfo) {
            throw throwServerError({
              message: 'No se encuentra el registro',
              status: 409,
            });
          }
          return await this.lg_first_LOGIN(deviceInfo, body, transaction);
          
        }

        //########### (EXISTE Dispositivo) MÁS DE UN LOGUEO 
        if (withToken && listLogin.length >= 1) {
          //deviceToken, infoAuth
          if (!deviceToken) {
            return errorResult({
              status: 400,
              message: 'El token del dispositivo es requerido pero no se proporcionó.'
            });
          }
          return await this.lg_existDevice_LOGIN(deviceToken, body, transaction);          
        }

        //########### (NUEVO DISPOSITIVO) MÁS DE UN LOGUEO
        if (!withToken && listLogin.length >= 1) {
          return await this.lg_newDevice_LOGIN(body, transaction);          
        }

      } catch (err: any) {
        handleServiceError(err, 'Error login', 'AuthService');
      }
    })
  }
  private async lg_first_LOGIN(deviceInfo: DevicesCreationAttributes, dataAuth: Auth, transaction: any) {

    try {
      const IdAuth = dataAuth.IdAuth;
      //* Crear registro en tabla Device          
      const device = await this._createDevice(deviceInfo, transaction)
      /**Se crea un registro en DeviceAuth */
      const deviceaAuth = await DeviceAuth.create({ IdAuth, IdDevice: device.IdDevices }, { transaction });

      //* se crea un registro en tabla Login con (IdAuth, IdDevice) con activo true 
      const login = await this._createLogin(dataAuth.IdAuth, deviceaAuth.IdDeviceAuth, transaction)

      /**Se obtiene valor del la pagina de usuario para el TOKEN_ACCESS*/
      const userPage = await UserPage.findOne({ where: { IdUser: dataAuth.IdUser } });
      if (!userPage) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      /**Se genera token refresh */
      const dataRefreshToken: TokenRefresh = { IdDeviceAuth: deviceaAuth.IdDeviceAuth };
      const expiracionDias = 30
      const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`);
      if (!tokenRefresh || tokenRefresh.code != 200) {
        throw throwServerError({
          status: 409,
          message: 'Error en el servicio al generar token'
        });
      }

      /**se inserta el token Refresh a la tabla RefreshToken */
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

      /**Se optiene datos del usuario y se generan el Access token */
      const dataAccessToken: TokenLogin = { IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
      const tokenLogin = await this._generateToken(dataAccessToken, 'Login');
      if (tokenLogin.code != 200) {
        throw throwServerError({
          status: 409,
          message: 'Error en el servicio al generar token'
        });
      }

      /**Se Genera un UUID y se actualiza en la tabla Device */
      const deviceToken = uuidv4();
      device.Token = deviceToken
      await this._updateDevice(device, transaction)

      return successResult({
        status: 200,
        message: '¡Inicio de sesión exitoso! Bienvenido.',
        body:{
          deviceVerify: true,
          firstLogin: true,
          TOKEN_ACCESS: tokenLogin.token,          
        },
        tokens: {
          TOKEN_DEVICE: deviceToken,
          TOKEN_REFRESH: tokenRefresh.token,
        }
      });

    } catch (err: any) {
      handleServiceError(err, 'Error login', 'AuthService');
    }
  }
  private async lg_existDevice_LOGIN(deviceToken: string, dataAuth: Auth, transaction: any) {
    try {
      const IdAuth = dataAuth.IdAuth;

      /**Se obtiene el registro el device por uuid */
      const device = await Devices.findOne({
        where: { Token: deviceToken }
      })
      if (!device) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });

      }

      // Validar si no tiene codigos pendientes que verificar en esttus 6 (6='Registro de dispositivo')
      const dataActivo = await CodeAutentication.findOne({
        where: {
          IdAuth: dataAuth.IdAuth,
          IsActive: true,
          IdTypeCode: 6
        }
      })
      if (dataActivo?.IsActive) {
        //SE TIENE UN CODIGO PENDIENTE POR VALIDAR 
        const response = await this.lg_newDevice_LOGIN(dataAuth, transaction)
        return response;
      }

      //* Actualiza en tabla login todos los registros en el campo activo=false donde el idDevice sea el del token
      const deviceAuth = await DeviceAuth.findOne({
        where: { IdDevice: device.IdDevices, IdAuth }
      })
      if (!deviceAuth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }
      await this._updateLoginToInactive(deviceAuth.IdDeviceAuth, IdAuth)

      /**se crea un registro en tabla login con (IdAuth, IdDeviceAuth) con activo true */
      const login = await this._createLogin(dataAuth.IdAuth, deviceAuth.IdDeviceAuth, transaction)

      /**Se genera token refresh */
      const dataRefreshToken: TokenRefresh = { IdDeviceAuth: deviceAuth.IdDevice };
      const expiracionDias = 30
      const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`);
      if (tokenRefresh.code != 200) {
        throw throwServerError({
          status: 409,
          message: 'Error en el servicio al generar token'
        });
      }

      /**se inserta el token Refresh a la bd */
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

      /**Se optiene datos del usuario y se generan el Access token */
      const userPage = await UserPage.findOne({ where: { IdUser: dataAuth.IdUser } });
      if (!userPage) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }
      const dataAccessToken: TokenLogin = { IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
      const tokenLogin = await this._generateToken(dataAccessToken, 'Login');
      if (tokenLogin.code != 200) {
        throw throwServerError({
          status: 409,
          message: 'Error en el servicio al generar token'
        });
      }

      return successResult({
        status: 200,
        message: '¡Inicio de sesión exitoso! Bienvenido de nuevo.',
        body:{
          deviceVerify: true,
          firstLogin: false,
          TOKEN_ACCESS: tokenLogin.token,          
        },
        tokens: {
          TOKEN_REFRESH: tokenRefresh.token,
        }
      });

    } catch (err: any) {
      handleServiceError(err, 'Error login', 'AuthService');
    }
  }
  private getfechaToken(addDays: number) {
    // Sumar días
    const fechaCon30Dias = new Date(Date.now() + addDays * 24 * 60 * 60 * 1000)
    return fechaCon30Dias
  }
  private async _createDevice(deviceInfo: DevicesCreationAttributes, transaction?: Transaction): Promise<Devices> {
    try {
      const devices = await Devices.create(deviceInfo, { transaction });
      return devices
    } catch (err: any) {
      handleServiceError(err, '_createDevice', 'AuthService');
    }
  }
  private async _updateDevice(deviceInfo: Devices, transaction: Transaction): Promise<Devices> {
    try {
      const devices = await deviceInfo.update({ ...deviceInfo, Token: deviceInfo.Token }, { transaction });
      return devices
    } catch (err: any) {
      handleServiceError(err, '_updateDevice', 'AuthService');
    }
  }
  private async _createLogin(IdAuth: number, IdDeviceAuth: number, transaction?: Transaction): Promise<Login> {
    try {

      return await Login.create({
        IdAuth,
        IdDeviceAuth
      }, { transaction });
    } catch (err: any) {
      handleServiceError(err, '_createLogin', 'AuthService');
    }
  }
  private async _sendMailVerifyDevice(Email: string, Name: string, Firstname: string, Code: string): Promise<any> {
    try {
      const mailConfig: MailServiceConfig = {
        accion: MailActions.NuevoDispositivo,
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
      handleServiceError(err, '_sendMailVerifyDevice', 'AuthService');
    }

  }
  private async _updateLoginToInactive(IdDeviceAuth: number, IdAuth: number): Promise<void> {
    try {
      await Login.update({ Active: false }, {
        where: { IdAuth, IdDeviceAuth }
      })
    } catch (err: any) {
      handleServiceError(err, '_updateLoginToInactive', 'AuthService');
    }
  }
  //#endregion ######################################### LOGIN


  //#region ######################################### NEW DEVICE  
  protected async lg_validCodeDevice(Code: string, TOKEN_NEWDEVICE: string, deviceInfo: DevicesCreationAttributes): Promise<ServiceResult<any>> {
    return  await this.lg_ValidCodeDevic_pv (Code, TOKEN_NEWDEVICE, deviceInfo)    
  }
  protected async fc_validViewNewDevice(Token: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdAuth } = response.payload
      if (!IdAuth) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const auth = await Auth.findOne({
        where: { IdAuth }
      })
      if (!auth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }
      const user = await User.findOne({
        where: { IdUser: auth.IdUser }
      })
      if (!user) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }


      return successResult({
        status: 200,
        message: 'Se permite su acceso para validar el dispositivo',
        body: {
          email: maskEmail(user.Email)
        }
      });

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', 'AuthService');
    }
  }
  protected async fc_newCode_NewDevice(Token: string): Promise<ServiceResult<any>> {
    try {
      /**Se valida Token */
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      /**Se obtiene los datos con el token */
      const { IdAuth } = response.payload
      if (!IdAuth) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const auth = await Auth.findByPk(IdAuth)
      if (!auth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      /**Se crea un nuevo Codigo */
      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: IdAuth,
        IdTypeCode: 6 //(6='Registro de dispositivo')
      });
      if (!codeAuth) {
        throw throwServerError({
          status: 409,
          message: 'No se genero código'
        });
      }

      /**Se obtiene los datos del usuario */
      const userData = await User.findByPk(auth.IdUser)
      if (!userData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      /**Se oenvia código por correo */
      const code = codeAuth.Code
      await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code || '');

      return successResult({
        status: 200,
        message: 'Se ha enviado correo con nuevo código'
      });

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', 'AuthService');
    }
  }
  private async lg_newDevice_LOGIN(dataAuth: Auth, transaction: any) {
    /** Se usa mismo metodo para generar un codigo nuevo y enviar por correo cuando:
     * es nuevo dispositivo y 
     * cuando esta pendiente por activar un codigo
     */
    try {
      const IdAuth = dataAuth.IdAuth;

      /**SE CREA OTRO CÓDIGO PARA VALIDAR EL DISPOSITIVO */
      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth,
        IdTypeCode: 6, //(6='Registro de dispositivo')    
      }, transaction);
      if (!codeAuth) {
        throw throwServerError({
          status: 409,
          message: 'No se genero código'
        });
      }

      /**SE OTIEN LOS DATOS DEL USUARIO */
      const userData = await User.findByPk(dataAuth.IdUser)
      if (!userData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      /**se manda codigo por correo  */
      const code = codeAuth.Code
      await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code || '');

      /**Se genera token */
      const tokenNewDevice: Token_New_Device = { IdAuth };
      const tokenValidCode = await this._generateToken(tokenNewDevice, 'validCode', '30m');
      if (tokenValidCode.code != 200) {
        throw throwServerError({
          status: 409,
          message: 'Error en el servicio al generar token'
        });
      }

      return successResult({
        status: 200,
        message: '¡Correo enviado con éxito! Hemos enviado un código para verificar tu nuevo dispositivo.',
        body:{
          deviceVerify: false,
          firstLogin: false,
          TOKEN_NEWDEVICE: tokenValidCode.token,        
        },
        tokens:null
      });

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', 'AuthService');
    }
  }
  private async lg_ValidCodeDevic_pv (Code: string, TOKEN_NEWDEVICE: string, deviceInfo: DevicesCreationAttributes): Promise<any>{
    return await withTransaction(async (transaction) => {
      try {

        /**SE VALIDA EL TOKEN  */
        if (!TOKEN_NEWDEVICE) {
          return errorResult({
            status: 422,
            message: 'El token del dispositivo es requerido pero no se proporcionó.'
          });
        }
        const getToken = await this._varifyToken(TOKEN_NEWDEVICE)
        if (!getToken.valid) {
          return errorResult({
            status: getToken.code,
            message: getToken.message
          });
        }

        /**Se obtiene los datos de Auth */
        const { IdAuth } = getToken.payload
        const authData = await Auth.findByPk(IdAuth)
        if (!authData) {
          throw throwServerError({
            message: 'No se encuentra el registro',
            status: 409,
          });
        }

        /**Se valida el codigó recibido */
        const code_AutService = new CodeAutenticationService();
        const validCode = await code_AutService.validCode(Code, IdAuth);
        if (validCode == 0) {
          return errorResult({
            status: 422,
            message: 'Código incorrecto'
          });
        }


        //Crear registro en tabla Device y DeviceAuth 
        const deviceToken = uuidv4();
        deviceInfo.Token = deviceToken
        const device = await this._createDevice(deviceInfo, transaction)
        const deviceAuth = await DeviceAuth.create({ IdAuth, IdDevice: device.IdDevices }, { transaction });

        //*Se crea un registro en tabla login con (IdAuth, IdDeviceAuth) con campo activo=true  
        const login = await this._createLogin(IdAuth, deviceAuth.IdDeviceAuth, transaction)

        /**Se genera el token REFRESH y se inserta en la tabla*/
        const dataRefreshToken: TokenRefresh = { IdDeviceAuth: deviceAuth.IdDevice };
        const expiracionDias = 30
        const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`);
        if (tokenRefresh.code != 200) {
          throw throwServerError({
            status: 409,
            message: 'Error en el servicio al generar token'
          });
        }

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

        /**SE OBTIENE LOS VALORES DE USER PARA EL TOKEN ACCESS */
        const userPage = await UserPage.findOne({ where: { IdUser: authData.IdUser } });
        if (!userPage) {
          throw throwServerError({
            message: 'No se encuentra el registro',
            status: 409,
          });
        }
        const dataAccessToken: TokenLogin = { IdAuth: IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
        const tokenLogin = await this._generateToken(dataAccessToken, 'Login');
        if (tokenLogin.code != 200) {
          throw throwServerError({
            status: 409,
            message: 'Error en el servicio al generar token'
          });
        }

        return successResult({
          status: 200,
          message: '¡Dispositivo verificado con éxito! Ahora puedes acceder a tu cuenta de manera segura.',
          body:{
            deviceVerify: true,
            firstLogin: false,
            TOKEN_ACCESS: tokenLogin.token,            
          },
          tokens: {
            TOKEN_REFRESH: tokenRefresh.token,
            TOKEN_DEVICE: deviceToken,
          }
        });

      } catch (err: any) {
        handleServiceError(err, 'Error', 'AuthService');
      }
    })
  }
  //#endregion ######################################### NEW DEVICE  


  //#region ######################################### CHANGE PASSWORD  
  protected async _recoveryPassword(Email: string): Promise<ServiceResult<any>> {
    try {
      const user = await User.findOne({
        where: { Email }
      });
      if (!user) {
        return errorResult({
          status: 422,
          message: `'Si existe una cuenta asociada con este correo, recibirás un email'`
        });
      }

      const auth = await Auth.findOne({
        where: { IdUser: user.IdUser }
      })
      if (!auth) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
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
        accion: MailActions.RecoveryPassword,
        to: user.Email,
        subject: 'Solicitud de cambio de contraseña',
        dataMail: {
          name: user.Name,
          firstname: user.Firstname,
          token: token,
          code: codeAuth.Code ?? '',
        }
      };

      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();
      if (!responseMail.send) {
        throw throwServerError({
          status: 409,
          message: responseMail.response
        });
      }

      return successResult({
        status: 200,
        message: `¡Solicitud aprovada!, Accede al correo (${Email}) para seguir el proceso`,
        body: {
          token,
          infoUsuario: {
            Name: user.Name,
            Firstname: user.Firstname
          },
        }
      });


    } catch (err: any) {
      handleServiceError(err, '_recoveryPassword', 'AuthService');
    }
  }
  protected async _validDataUser(token: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdUser } = response.payload
      if (!IdUser) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const authUser = await Auth.findOne({
        where: { IdUser }
      })
      if (!authUser) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      if (authUser.Status != 2 && authUser.Status != 3) {
        return errorResult({
          status: 422,
          message: 'El estatus de usuario no se encuentra en condiciones para solicitar el cambio de contraseña'
        });
      }

      return successResult({
        status: 200,
        message: 'Solicitud aprovada'
      });


    } catch (err: any) {
      handleServiceError(err, '_validDataUser', 'AuthService');
    }
  }
  protected async _changePassword(Password: string, Token: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdUser } = response.payload
      if (!IdUser) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const userService = new UserService()
      const {body, error} = await userService.findByPkUser_forAuth(IdUser)
      
      if (error || !body) {
        return errorResult({
          status: 422,
          message: `Si existe una cuenta asociada con este correo, recibirás un email`
        });

      }

      const authUser = await Auth.findOne({
        where: { IdUser }
      })
      if (!authUser) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);
      authUser.Password = hashedPassword
      authUser.Pw = Password

      await authUser.save()

      // Envía el correo
      const mailConfig: MailServiceConfig = {
        accion: MailActions.PasswordChangeSuccessful,
        to: body.Email,
        subject: 'Confirmación de cambio de contraseña',
        dataMail: {
          name: body.Name,
          firstname: body.Firstname
        }
      };
      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();
      if (!responseMail.send) {
        return errorResult({
          status: 422,
          message: responseMail.response
        });
      }

      return successResult({
        status: 200,
        message: '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña'
      });



    } catch (err: any) {
      handleServiceError(err, '_changePassword', 'AuthService');
    }

  }

  protected async _validCode(Code: string, Token: string): Promise<ServiceResult<any>> {
    try {
      const response = await this._varifyToken(Token)

      if (!response.valid) {
        return errorResult({
          message: response.message,
          status: response.code,
        });
      }

      const { IdUser } = response.payload
      if (!IdUser) {
        return errorResult({
          status: 400,
          message: `Token invalido`
        });
      }

      const userService = new UserService()
      const {body, status, message, error} = await userService.findByPkUser_forAuth(IdUser)
      if (!body || error) {
        return errorResult({
          status,
          message: message
        });
      }

      const authData = await Auth.findOne({
        where: { IdUser: body.IdUser }
      })
      if (!authData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if (dataCode == 0) {
        return errorResult({
          status: 422,
          message: 'El Cóodigo incorrecto'
        });
      }

      const token = generateToken({
        dataToken: {
          IdUser: body.IdUser,
        },
        expiresIn: '30m',
      });



      return successResult({
        status: 200,
        message: `¡Código correcto! Puedes cambiar tu contraseña`,
        body: {
          token
        }
      });

    } catch (err: any) {
      handleServiceError(err, '_validCode', 'AuthService');
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

  - Al solicitar un nuevo ACCESS TOKEN obtener la expiración(t_ex_Rfh) de un TOKEN REFRESH 
  - Si (t_ex_Rfh) es menor al tiempo de expiración del nuevo ACCESS TOKEN solicitar un nuevo TOKEN REFRESH y pasar esos valores al ACCESS TOKEN 
  - Incluye en la respuesta del Access Token o en un endpoint dedicado información sobre la proximidad de expiración del Refresh Token, 
    para que el cliente pueda actuar antes de que expire.
  - Renovación automática (si es seguro):
  - Si el Refresh Token está a punto de expirar (pero no ha expirado), permite al cliente renovar el Refresh Token generando uno 
  nuevo sin necesidad de forzar el inicio de sesión.
*/
  private async _generateToken(
    data: TokenLogin | TokenDevice | TokenRefresh | Token_New_Device,
    type: 'Login' | 'Refresh' | 'Device' | 'validCode',
    expirationTime: string = ''
  ): Promise<{ token?: string; message?: string; code: number }> {
    try {
      let contentToken: TokenPayload | null = null;
      // Validación y generación de contenido del token según el tipo
      switch (type) {
        case 'Login': //Access Token
          contentToken = this._validateLoginData(data as TokenLogin);
          expirationTime = '1h';
          break;
        
        case 'Refresh': //Access Token
          contentToken = this._validateRefreshData(data as TokenRefresh);
          break;

        case 'Device':
          contentToken = this._validateDeviceData(data as TokenDevice);
          expirationTime = '30d';
          break;

        case 'validCode':
          contentToken = this._validateDataNewDevice(data as Token_New_Device);
          break;

        default:
          return { message: 'Tipo de caso no válido', code: 400 };
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
      handleServiceError(err, '_generateToken', 'AuthService');
    }
  }
  private _validateLoginData(data: TokenLogin): TokenPayload | null {
    if (!data.IdAuth || !data.IdUserPage) {
      throw new Error('Faltan datos para generar el token de Login');
    }
    return data;
  }
  private _validateDeviceData(data: TokenDevice): TokenPayload | null {
    if (!data.IdDevice) {
      throw new Error('Faltan datos para generar el token de Dispositivo');
    }
    return data;
  }
  private _validateRefreshData(data: TokenRefresh): TokenPayload | null {
    if (!data.IdDeviceAuth) {
      throw new Error('Faltan datos para generar el token de Refresh');
    }
    return data;
  }
  private _validateDataNewDevice(data: Token_New_Device): TokenPayload | null {
    if (!data.IdAuth) {
      throw new Error('Faltan datos para generar el token de Refresh');
    }
    return data;
  }
  private async createRefreshToken({ Token, ExpiresAt, IsActive = true, IdAuth, IdDeviceAuth, LastUsedAt }
    : RefreshTokenAttributes, transaction?: Transaction): Promise<RefreshToken> {
    try {
      const refreshToken = await RefreshToken.create({
        Token,
        ExpiresAt,
        IsActive,
        IdAuth,
        IdDeviceAuth,
        LastUsedAt
      }, { transaction });

      return refreshToken;
    } catch (err: any) {
      handleServiceError(err, 'Could not create refresh token', 'AuthService');
    }
  }
  private async _varifyToken(token: string): Promise<any> {
    try {
      const response = await verifyToken(token)
      if (!response.valid) return response

      if (!this._HasPayload_Private(response))
        return response

      return response
    } catch (err: any) {
      handleServiceError(err, '_varifyToken', 'AuthService');
    }
  }
  public async service_varifyToken(token: string): Promise<ServiceResult<any>> {
    try {
      const response = await verifyToken(token)
      if (!response.valid) return errorResult({
        message: response.message,
        status: response.code
      })

      if (!this._HasPayload_Private(response))
        return errorResult({
          message: response.message,
          status: response.code
        })

      return successResult({
        message: response.message,
        status: response.code
      })
    } catch (err: any) {
      handleServiceError(err, '_varifyToken', 'AuthService');
    }
  }

  private _HasPayload_Private(response: { payload?: TokenPayload }): response is { payload: TokenPayload } {
    return response.payload !== undefined;
  }
  //#endregion ######################################### TOKEN

}

