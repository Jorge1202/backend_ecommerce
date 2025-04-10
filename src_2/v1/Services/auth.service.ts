import { Transaction, where } from 'sequelize';
const bcrypt = require("bcrypt");
import { withTransaction } from '../../Database/transaction_helper';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResult, errorResult, successResult, throwServerError } from '../../Utils/Response/ServiceResult';

import { generateToken } from '../../Secure/tokenJWT';
import { TokenLogin, Token_New_Device, TokenRefresh, TokenAuthUser } from '../../Secure/interfaceToken';
import { generateTokenAccess, generateTokenRefresh, generateTokenValidCode } from '../../Secure/generateTokens';
import { MailActions, MailServiceConfig, MailService } from '../../Mails/sendMail';
import { maskEmail } from '../../Mails/maskEmail';


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
import { Date_addDays, isWithinOneHour } from '../../Utils/fecha';


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

  // //#region ######################################### CREATION ACOUNT
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
        body: {
          auth,
          codeAuth,
        }
      });

    } catch (error: any) {
      handleServiceError(error, 'createAuth', 'AuthService')
    }
  }
  private async createAuth_Private(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error: any) {
      handleServiceError(error, '_createAuth', 'AuthService')
    }
  }
  // //#endregion ######################################### CREATION ACOUNT




  //#region ######################################### TOKEN
  protected async _newAccessToken(
    dataTokenRefresh: TokenRefresh,
    token_refresh: string
  ): Promise<ServiceResult<any>> {
    try {
      const { IdAuth, IdDeviceAuth, IdUserPage } = dataTokenRefresh;

      // 🔍 Buscar si el token de refresh existe en la base de datos
      const dataToken_refresh = await RefreshToken.findOne({
        where: { IdDeviceAuth, Token: token_refresh }
      });

      // ⚠️ Validar si el token existe y si tiene un tiempo de expiración válido
      if (!dataToken_refresh?.ExpiresAt) {
        return errorResult({ status: 409, message: 'No existe información del token' });
      }

      // 🔍 Buscar si el usuario tiene una sesión activa
      const dataAuth = await Auth.findByPk(IdAuth );

      // ⚠️ Validar si el usuario tiene sesión activa
      if (!dataAuth) {
        return errorResult({ status: 409, message: 'No existe información del token' });
      }

      // 🔍 Buscar si el usuario tiene una sesión activa
      const dataLogin = await Login.findOne({
        where: { IdAuth, IdDeviceAuth, Active: true }
      });

      // ⚠️ Validar si el usuario tiene sesión activa
      if (!dataLogin) {
        return errorResult({ status: 409, message: 'No existe información del token' });
      }

      // ⏳ Verificar si el token refresh está por expirar en menos de 1 hora
      if (isWithinOneHour(dataToken_refresh.ExpiresAt)) {
        // 🔄 Generar un nuevo token refresh
        const { body, status, error, message } = await this.newRefreshToken({ IdAuth, IdDeviceAuth, IdUserPage });

        // ⚠️ Si hubo un error al generar el nuevo token, retornar el mensaje de error
        if (error) {
          return errorResult({ status, message });
        }

        const { dataRefresh, token } = body;

        // 🔑 Generar y devolver un nuevo token de acceso con el refresh actualizado
        return this.generateTokenResponse(dataAuth.IdUser, IdAuth, IdUserPage, dataLogin.IdLogin, dataRefresh, token);
      }

      // 🟢 Si el token refresh aún es válido, devolver el token actual sin renovarlo
      return this.generateTokenResponse(dataAuth.IdUser, IdAuth, IdUserPage, dataLogin.IdLogin, {
        IdRefreshToken: dataToken_refresh.IdRefreshToken,
        ExpiresAt: dataToken_refresh.ExpiresAt
      });

    } catch (err: any) {
      // 🚨 Manejar errores y loguearlos
      handleServiceError(err, 'newRefreshToken', 'AuthResult');
    }
  }

  // 📌 Método auxiliar para generar el token de acceso y estructurar la respuesta
  private generateTokenResponse(
    IdUser: string,
    IdAuth: number,
    IdUserPage: number,
    IdLogin: number,
    dataRefresh: { IdRefreshToken: number, ExpiresAt: Date },
    tokenRefresh?: string // Este parámetro es opcional (solo si se renovó el token)
  ): ServiceResult<any> {
    // 🔑 Crear un objeto con la información del token de acceso
    const dataAccessToken: TokenLogin = { IdUser, IdAuth, IdUserPage, IdLogin, dataRefresh };

    // 🔄 Generar el token de acceso
    const tokenLogin = generateTokenAccess(dataAccessToken);

    // ⚠️ Si hubo un error al generar el token de acceso, lanzar un error
    if (tokenLogin.code !== 200) {
      throw throwServerError({ status: 409, message: 'Error en el servicio al generar token' });
    }

    // 🟢 Retornar el token generado (si se renovó el refresh, incluirlo en la respuesta)
    return successResult({
      body: { tokenLogin, tokenRefresh },
      status: 200,
      message: tokenRefresh ? 'Se creó el token Refresh' : 'Se generó el token de acceso'
    });
  }

  private async newRefreshToken({ IdAuth, IdDeviceAuth, IdUserPage }: TokenRefresh, transaction?: Transaction): Promise<ServiceResult<any>> {
    try {

      if (!IdAuth && !IdDeviceAuth && !IdUserPage) {
        return errorResult({
          status: 409,
          message: 'Se necesita la información para generar token'
        })
      }

      // const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`);
      const tokenRefresh = generateTokenRefresh({ IdAuth, IdDeviceAuth, IdUserPage })
      if (!tokenRefresh.token || tokenRefresh.code != 200) {
        throw throwServerError({
          status: 409,
          message: 'Error en el servicio al generar token'
        });
      }

      const insertTokenRefresh = {
        IdRefreshToken: 0,
        IsActive: true,
        Token: tokenRefresh.token,
        IdAuth: IdAuth,
        IdDeviceAuth: IdDeviceAuth,
        IdUserPage: IdUserPage,
        ExpiresAt: Date_addDays(tokenRefresh.expiresIn)
      };

      const dataTokenRefresh = await this.createRefreshToken(insertTokenRefresh, transaction)
      if (!dataTokenRefresh) {
        throw throwServerError({
          status: 500,
          message: 'Falla en la base de datos.'
        });
      }

      const dataRefresh = {
        IdRefreshToken: dataTokenRefresh.IdRefreshToken,
        ExpiresAt: dataTokenRefresh.ExpiresAt || new Date(),
      }
      return successResult({
        body: {
          dataRefresh,
          token: dataTokenRefresh.Token
        },
        status: 200,
        message: 'Se creo el token Refresh'
      })

    } catch (err: any) {
      handleServiceError(err, 'newRefreshToken', 'AuthResult');
    }

  }
  private async createRefreshToken(
    { Token, ExpiresAt, IsActive = true, IdAuth, IdDeviceAuth, LastUsedAt }: RefreshTokenAttributes,
    transaction?: Transaction): Promise<RefreshToken> {
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
      handleServiceError(err, 'createRefreshToken', 'AuthResult');
    }
  }
  //#endregion ######################################### TOKEN

}

