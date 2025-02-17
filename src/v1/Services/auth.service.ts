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
import { ServiceResponse, errorResponse, successResponse } from '../../Utils/Response/ServiceResponse';

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

  //#region ######################################### CREATION ACOUNT
  public async createAuth(authData: AuthCreationAttributes, transaction: Transaction): Promise<ServiceResponse<AuthResult>> {
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
        return errorResponse({
          message: 'Error al crear el registro',
          statusCode: 422,
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Se ha creado el registro',
        body:{
          auth,
          codeAuth,
        }
      });

    } catch (error: any) {
      handleServiceError(error, 'createAuth', error.statusCode)
    }
  }
  protected async _generateCodeEmail(Email: string): Promise<ServiceResponse<any>> {
    try {

      const userData = await User.findOne({
        where: { Email }
      })
      if (!userData) {
        return errorResponse({
          message: 'El correo es incorrecto',
          statusCode: 422,
        });
      }

      const auth = await Auth.findOne({
        where: { IdUser: userData.IdUser }
      })
      if (!auth) {
        return errorResponse({
          statusCode: 422,
          message: 'El correo es incorrecto'
        });
      }

      if (auth.Status == 2) {
        return errorResponse({
          statusCode: 422,
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
      const responseMail = await mailService.send();

      return successResponse({
        statusCode: 200,
        message: '¡Código generado! Te llegará a tu correo electrónico.',
      });

    } catch (error: any) {
      handleServiceError(error, '_generateCodeEmail', error.statusCode)
    }
  }
  private async createAuth_Private(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error: any) {
      handleServiceError(error, '_createAuth', error.statusCode)
    }
  }
  protected async _validCodeByEmail(Token: string, Code: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdAuth } = response.payload

      const authData = await Auth.findOne({
        where: { IdAuth }
      })
      if (!authData) {
        return errorResponse({
          message: 'El usuario no existe',
          statusCode: 422,
        });
      }

      const userData = await User.findOne({
        where: { IdUser: authData.IdUser }
      })
      if (!userData) {
        return errorResponse({
          message: 'El usuario no existe',
          statusCode: 422,
        });
      }

      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if (dataCode == 0) {
        return errorResponse({
          message: 'El Cóodigo es incorrecto',
          statusCode: 422,
        });
      }

      authData.Status = 2; //status de auth queda activo=2
      authData.save();

      // 6. Crea code para Iniciar sesión  Tipo=5
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: authData.IdAuth,
        IdTypeCode: 5
      });
      return successResponse({
        message: 'El Cóodigo generado',
        statusCode: 200,
        body: {
          Email: userData.Email,
          Code: codeAuth.Code
        }
      });

    } catch (error: any) {
      handleServiceError(error, '_validCodeByEmail', error.statusCode)
    }
  }
  protected async _validViewVerifyEmail(Token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdAuth } = response.payload
      if (!IdAuth) {
        return successResponse({
          message: `Token invalido`,
          statusCode: 422,
        });

      }

      //Validar si cuenta con un code estatus 3
      const IdTypeCode = 3;
      const codeValid = await CodeAutentication.findOne({
        where: { IdTypeCode, IdAuth: IdAuth }
      });
      if (!codeValid) {
        return errorResponse({
          statusCode: 422,
          message: 'No cuenta con solicitud de verificacion de correo'
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Vista autorizada'
      });

    } catch (error: any) {
      handleServiceError(error, '_validCodeByEmail', error.statusCode)
    }
  }
  protected async _reSendCode(Token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdAuth } = response.payload
      const auth = await Auth.findOne({
        where: { IdAuth }
      })
      if (!auth) {
        return errorResponse({
          statusCode: 422,
          message: 'No existe registro'
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
        return errorResponse({
          statusCode: 422,
          message: 'No existe registro'
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
      const responseMail = await mailService.send();

      return successResponse({
        statusCode: 200,
        message: 'Se ha enviado correo con nuevo código'
      });
    } catch (err: any) {
      handleServiceError(err, '_reSendCode', err.statusCode);
    }
  }
  //#endregion ######################################### CREATION ACOUNT


  //#region ######################################### LOGIN
  protected async loginAfterRegister(params: ParamsLogin): Promise<ServiceResponse<any>> {
    try {
      const { Login } = params
      const _Login: LoginParams = Login
      const { Username: Email, Code } = _Login; //Cambio de nombre de variables

      const user = await User.findOne({
        where: { Email }
      });
      if (!user) {
        return errorResponse({
          statusCode: 422,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        });
      }

      const authData = await Auth.findOne({
        where: { IdUser: user.IdUser }
      });
      if (!authData) {
        return errorResponse({
          statusCode: 422,
          message: 'Datos incorrectos ¡Intentelo nuevamente!',
        });
      }

      const codeValid = await CodeAutentication.findOne({
        where: { Code, IdAuth: authData.IdAuth }
      });
      if (!codeValid) {
        return errorResponse({
          statusCode: 422,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        });
      }
      if (!codeValid.IsActive) {
        return errorResponse({
          statusCode: 422,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
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
      return successResponse({
        statusCode: 200,
        message: 'Se genero login',
        body: responseLogin
      });

    } catch (err: any) {
      handleServiceError(err, 'loginAfterRegister', err.statusCode);
    }
  }
  protected async _login(params: ParamsLogin, whithCode: boolean = false): Promise<ServiceResponse<any>> {
    return await this._login_pv(params, whithCode)
  }
  private async _login_pv (params: ParamsLogin, whithCode: boolean = false): Promise<any>{
    return await withTransaction(async (transaction) => {
      try {
        const { withToken, deviceToken, deviceInfo } = params

        //Valida parametros
        const infoAuth = await this.fc_validParams_login(params.Login, whithCode);
        if (infoAuth.statusCode !== 200) {
          return errorResponse({
            statusCode: 422,
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
            return errorResponse({
              statusCode: 422,
              message: 'Los datos del dispositivo no se encuentran.'
            });
          }
          return await this.lg_first_LOGIN(deviceInfo, body, transaction);
          
        }

        //########### (EXISTE Dispositivo) MÁS DE UN LOGUEO 
        if (withToken && listLogin.length >= 1) {
          //deviceToken, infoAuth
          if (!deviceToken) {
            return errorResponse({
              statusCode: 422,
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
        handleServiceError(err, 'Error login', err.statusCode);
      }
    })
  }
  private async fc_validParams_login(params: LoginParams, whithCode: boolean): Promise<ServiceResponse<any>> {
    try {
      const { Username, Password } = params;

      const dataAuth = await Auth.findOne({ where: { Username } })
      if (!dataAuth) {
        return errorResponse({
          statusCode: 403,
          message: 'Datos incorrectos ¡Intentelo nuevamente!'
        });
      }

      if (dataAuth.Status === 1) {
        // Enviar correo con codigo de verificacion de email
        return errorResponse({
          statusCode: 422,
          message: `Codigo`
        });
      }

      //verifica el status que este activo el user
      if (dataAuth.Status !== 2 && dataAuth.Status != 3) {
        const status = await StatusAuth.findByPk(dataAuth.Status)
        return errorResponse({
          statusCode: 422,
          message: `${status?.Description}`
        });
      }

      if (!whithCode) {
        const isPasswordValid = await bcrypt.compare(Password, dataAuth.Password);
        if (!isPasswordValid) {
          return errorResponse({
            statusCode: 403,
            message: 'Datos incorrectos ¡Intentelo nuevamente!'
          });
        }
      }

      return successResponse({
        statusCode: 200,
        message: 'Datos incorrectos ¡Intentelo nuevamente!',
        body: dataAuth
      });

    } catch (err: any) {
      handleServiceError(err, 'validation', err.statusCode);
    }
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
        return errorResponse({
          statusCode: 400,
          message: 'No existe registro en tabla userPage'
        });
      }

      /**Se genera token refresh */
      const dataRefreshToken: TokenRefresh = { IdDeviceAuth: deviceaAuth.IdDeviceAuth };
      const expiracionDias = 30
      const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`);
      if (!tokenRefresh || tokenRefresh.code != 200) {
        return errorResponse({
          statusCode: 400,
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
        return errorResponse({
          statusCode: 400,
          message: 'Error en el servicio al generar token'
        });
      }

      /**Se Genera un UUID y se actualiza en la tabla Device */
      const deviceToken = uuidv4();
      device.Token = deviceToken
      await this._updateDevice(device, transaction)

      return successResponse({
        statusCode: 200,
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
      handleServiceError(err, 'Error login', err.statusCode);
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
        return errorResponse({
          statusCode: 422,
          message: 'No se encontro el dispositivo'
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
        return errorResponse({
          statusCode: 422,
          message: 'No se encontro el dispositivo'
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
        return errorResponse({
          statusCode: 400,
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
        return errorResponse({
          statusCode: 422,
          message: 'No existe registro en tabla userPage'
        });
      }
      const dataAccessToken: TokenLogin = { IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
      const tokenLogin = await this._generateToken(dataAccessToken, 'Login');
      if (tokenLogin.code != 200) {
        return errorResponse({
          statusCode: 400,
          message: 'Error en el servicio al generar token'
        });
      }

      return successResponse({
        statusCode: 200,
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
      handleServiceError(err, 'Error login', err.statusCode);
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
      handleServiceError(err, '_createDevice', err.statusCode);
    }
  }
  private async _updateDevice(deviceInfo: Devices, transaction: Transaction): Promise<Devices> {
    try {
      const devices = await deviceInfo.update({ ...deviceInfo, Token: deviceInfo.Token }, { transaction });
      return devices
    } catch (err: any) {
      handleServiceError(err, '_updateDevice', err.statusCode);
    }
  }
  private async _createLogin(IdAuth: number, IdDeviceAuth: number, transaction?: Transaction): Promise<Login> {
    try {

      return await Login.create({
        IdAuth,
        IdDeviceAuth
      }, { transaction });
    } catch (err: any) {
      handleServiceError(err, '_createLogin', err.statusCode);
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
      handleServiceError(err, '_sendMailVerifyDevice', err.statusCode);
    }

  }
  private async _updateLoginToInactive(IdDeviceAuth: number, IdAuth: number): Promise<void> {
    try {
      await Login.update({ Active: false }, {
        where: { IdAuth, IdDeviceAuth }
      })
    } catch (err: any) {
      handleServiceError(err, '_updateLoginToInactive', err.statusCode);
    }
  }
  //#endregion ######################################### LOGIN


  //#region ######################################### NEW DEVICE  
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
        return errorResponse({
          statusCode: 422,
          message: 'No se genero código'
        });
      }

      /**SE OTIEN LOS DATOS DEL USUARIO */
      const userData = await User.findByPk(dataAuth.IdUser)
      if (!userData) {
        return errorResponse({
          statusCode: 422,
          message: 'No se encontro usuario'
        });
      }

      /**se manda codigo por correo  */
      const code = codeAuth.Code
      await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code || '');

      /**Se genera token */
      const tokenNewDevice: Token_New_Device = { IdAuth };
      const tokenValidCode = await this._generateToken(tokenNewDevice, 'validCode', '30m');
      if (tokenValidCode.code != 200) {
        return errorResponse({
          statusCode: 400,
          message: 'Error en el servicio al generar token'
        });
      }

      return successResponse({
        statusCode: 200,
        message: '¡Correo enviado con éxito! Hemos enviado un código para verificar tu nuevo dispositivo.',
        body:{
          deviceVerify: false,
          firstLogin: false,
          TOKEN_NEWDEVICE: tokenValidCode.token,        
        },
        tokens:null
      });

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', err.statusCode);
    }
  }
  protected async lg_validCodeDevice(Code: string, TOKEN_NEWDEVICE: string, deviceInfo: DevicesCreationAttributes): Promise<ServiceResponse<any>> {
    return  await this.lg_ValidCodeDevic_pv (Code, TOKEN_NEWDEVICE, deviceInfo)    
  }

  private async lg_ValidCodeDevic_pv (Code: string, TOKEN_NEWDEVICE: string, deviceInfo: DevicesCreationAttributes): Promise<any>{
    return await withTransaction(async (transaction) => {
      try {

        /**SE VALIDA EL TOKEN  */
        if (!TOKEN_NEWDEVICE) {
          return errorResponse({
            statusCode: 422,
            message: 'El token del dispositivo es requerido pero no se proporcionó.'
          });
        }
        const getToken = await this._varifyToken(TOKEN_NEWDEVICE)
        if (!getToken.valid) {
          return errorResponse({
            statusCode: getToken.code,
            message: getToken.message
          });
        }

        /**Se obtiene los datos de Auth */
        const { IdAuth } = getToken.payload
        const authData = await Auth.findByPk(IdAuth)
        if (!authData) {
          return errorResponse({
            statusCode: 422,
            message: 'Los datos del token no existen'
          });
        }

        /**Se valida el codigó recibido */
        const code_AutService = new CodeAutenticationService();
        const validCode = await code_AutService.validCode(Code, IdAuth);
        if (validCode == 0) {
          return errorResponse({
            statusCode: 422,
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
          return errorResponse({
            statusCode: 400,
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
          return errorResponse({
            statusCode: 422,
            message: 'No existe registro en la página de usuario'
          });
        }
        const dataAccessToken: TokenLogin = { IdAuth: IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
        const tokenLogin = await this._generateToken(dataAccessToken, 'Login');
        if (tokenLogin.code != 200) {
          return errorResponse({
            statusCode: 400,
            message: 'Error en el servicio al generar token'
          });
        }

        return successResponse({
          statusCode: 200,
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
        handleServiceError(err, 'Error', err.statusCode);
      }
    })
  }
  protected async fc_validViewNewDevice(Token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdAuth } = response.payload
      const auth = await Auth.findOne({
        where: { IdAuth }
      })
      if (!auth) {
        return errorResponse({
          statusCode: 422,
          message: 'No existe registro'
        });
      }
      const user = await User.findOne({
        where: { IdUser: auth.IdUser }
      })
      if (!user) {
        return errorResponse({
          statusCode: 422,
          message: 'No existe registro'
        });
      }


      return successResponse({
        statusCode: 200,
        message: 'Se permite su acceso para validar el dispositivo',
        body: {
          email: maskEmail(user.Email)
        }
      });

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', err.statusCode);
    }
  }
  protected async fc_newCode_NewDevice(Token: string): Promise<ServiceResponse<any>> {
    try {
      /**Se valida Token */
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      /**Se obtiene los datos con el token */
      const { IdAuth } = response.payload
      const auth = await Auth.findByPk(IdAuth)
      if (!auth) {
        return errorResponse({
          statusCode: 422,
          message: 'No existe registro'
        });
      }

      /**Se crea un nuevo Codigo */
      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createNewwCode({
        IdAuth: IdAuth,
        IdTypeCode: 6 //(6='Registro de dispositivo')
      });
      if (!codeAuth) {
        return errorResponse({
          statusCode: 422,
          message: 'No se genero código'
        });
      }

      /**Se obtiene los datos del usuario */
      const userData = await User.findByPk(auth.IdUser)
      if (!userData) {
        return errorResponse({
          statusCode: 422,
          message: 'No se genero código'
        });
      }

      /**Se oenvia código por correo */
      const code = codeAuth.Code
      await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code || '');

      return successResponse({
        statusCode: 200,
        message: 'Se ha enviado correo con nuevo código'
      });

    } catch (err: any) {
      handleServiceError(err, 'lg_validCodeDevice', err.statusCode);
    }
  }
  //#endregion ######################################### NEW DEVICE  


  //#region ######################################### CHANGE PASSWORD  
  protected async _recoveryPassword(Email: string): Promise<ServiceResponse<any>> {
    try {
      const user = await User.findOne({
        where: { Email }
      });
      if (!user) {
        return errorResponse({
          statusCode: 422,
          message: `'Si existe una cuenta asociada con este correo, recibirás un email'`
        });
      }

      const auth = await Auth.findOne({
        where: { IdUser: user.IdUser }
      })
      if (!auth) {
        return errorResponse({
          statusCode: 422,
          message: 'Usuario no autenticado'
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
        return errorResponse({
          statusCode: 416,
          message: responseMail.response
        });
      }

      return successResponse({
        statusCode: 200,
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
      handleServiceError(err, '_recoveryPassword', err.statusCode);
    }
  }
  protected async _validDataUser(token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdUser } = response.payload
      const authUser = await Auth.findOne({
        where: { IdUser }
      })
      if (!authUser) {
        return errorResponse({
          statusCode: 422,
          message: 'No existe usuario autenticado'
        });
      }

      if (authUser.Status != 2 && authUser.Status != 3) {
        return errorResponse({
          statusCode: 422,
          message: 'El estatus de usuario no se encuentra en condiciones para solicitar el cambio de contraseña'
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Solicitud aprovada'
      });


    } catch (err: any) {
      handleServiceError(err, '_validDataUser', err.statusCode);
    }
  }
  protected async _changePassword(Password: string, Token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)
      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdUser } = response.payload

      const userService = new UserService()
      const {body, error} = await userService.findByPkUser_forAuth(IdUser)
      
      if (error || !body) {
        return errorResponse({
          statusCode: 422,
          message: `Si existe una cuenta asociada con este correo, recibirás un email`
        });

      }

      const authUser = await Auth.findOne({
        where: { IdUser }
      })
      if (!authUser) {
        return errorResponse({
          statusCode: 422,
          message: 'Usuario no se relaciona con la autenticación'
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
        return errorResponse({
          statusCode: 422,
          message: responseMail.response
        });
      }

      return successResponse({
        statusCode: 200,
        message: '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña'
      });



    } catch (err: any) {
      handleServiceError(err, '_changePassword', err.statusCode);
    }

  }

  protected async _validCode(Code: string, Token: string): Promise<ServiceResponse<any>> {
    try {
      const response = await this._varifyToken(Token)

      if (!response.valid) {
        return successResponse({
          message: response.message,
          statusCode: response.code,
        });
      }

      const { IdUser } = response.payload

      if (!IdUser) {
        return errorResponse({
          statusCode: 422,
          message: `Los datos del Token son invalido`
        });

      }

      const userService = new UserService()
      const {body, statusCode, message, error} = await userService.findByPkUser_forAuth(IdUser)
      if (!body || error) {
        return errorResponse({
          statusCode: statusCode,
          message: message
        });
      }

      const authData = await Auth.findOne({
        where: { IdUser: body.IdUser }
      })
      if (!authData) {
        return errorResponse({
          statusCode: 422,
          message: 'Usuario no se relaciona con la autenticación'
        });
      }

      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if (dataCode == 0) {
        return errorResponse({
          statusCode: 422,
          message: 'El Cóodigo incorrecto'
        });
      }

      const token = generateToken({
        dataToken: {
          IdUser: body.IdUser,
        },
        expiresIn: '30m',
      });



      return successResponse({
        statusCode: 200,
        message: `¡Código correcto! Puedes cambiar tu contraseña`,
        body: {
          token
        }
      });

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
  private async _generateToken(
    data: TokenLogin | TokenDevice | TokenRefresh | Token_New_Device,
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
          contentToken = this._validateDataNewDevice(data as Token_New_Device);
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
  private async createRefreshToken({ Token, ExpiresAt, IsActive = true, IdAuth, IdDeviceAuth, LastUsedAt }: RefreshTokenAttributes, transaction?: Transaction): Promise<RefreshToken> {
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
      handleServiceError(err, 'Could not create refresh token', err.statusCode);
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
      handleServiceError(err, '_varifyToken', err.statusCode);
    }
  }
  private _HasPayload_Private(response: { payload?: TokenPayload }): response is { payload: TokenPayload } {
    return response.payload !== undefined;
  }
  //#endregion ######################################### TOKEN

}

