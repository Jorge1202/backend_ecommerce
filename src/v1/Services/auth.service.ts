import { Transaction } from 'sequelize';
const bcrypt = require("bcrypt");
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { verifyToken, TokenPayload} from '../Secure/tokenJWT';

import { Auth, AuthCreationAttributes } from '../models/auth'; 
import { CodeAutentication } from '../models/code-autentication';

import { CodeAutenticationService } from './code_autentication.service';
import error from '../../middlewares/error';
import { success } from '../../middlewares/response';

interface AuthResult {
  auth: Auth; // Asumiendo que 'Auth' es el tipo que devuelve 'createAuth'
  codeAuth: CodeAutentication; // Asumiendo que 'CodeAuthentication' es el tipo que devuelve '_createCodeAuthentication'
}

export class AuthService {

  public async createAuth(authData: AuthCreationAttributes, transaction: Transaction): Promise<AuthResult> {
    try {

      const hashedPassword = await bcrypt.hash(authData.Password, 10);
      authData = {...authData, Password:hashedPassword}

      const auth = await this._PrivateCreateAuth(authData, transaction);

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService.createCodeAuthentication({
        IdAuth: auth.IdAuth
      }, transaction);

      return {
        auth,
        codeAuth,
      };

    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }

  private async _PrivateCreateAuth(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }

  protected async _ProtectedFindByUsername(Username: string): Promise<Auth | null> {
    try {
      const record = await Auth.findOne({
        where: { Username } // Busca donde el campo 'username' coincida
      });
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con USERNAME ${Username}: ${error}`);
    }
  }
  private hasPayload(response: { payload?: TokenPayload }): response is { payload: TokenPayload } {
    return response.payload !== undefined;
  }

  private async _varifyTokenPrivate (token:string): Promise<any>{
    try {
      const response = await verifyToken(token)
      if(!response.valid)
        throw error(response.message, response.cade)
      
      if(!this.hasPayload(response))
        throw error(response.message, response.cade)

      return response
    } catch (err: any) {
      throw error(err.message, 409)      
    }

  }

  protected async _ProtectedRecoveryPassword (token: string): Promise<any> {
    try {
      const response = await this._varifyTokenPrivate(token)

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
      error(`${err.message}`, 500)
    }
  }

  protected async _changePasswordProtected (Password: string, Token:string): Promise<any> {
    try {
      const response = await this._varifyTokenPrivate(Token)
      
      const {IdUser} = response.payload
      const authUser = await Auth.findOne({
        where: {IdUser}
      })
      if (!authUser) {
        throw error('No existe usuario', 404)
      }

      const hashedPassword = await bcrypt.hash(Password, 10);
      const authUpdate = await authUser.update({Password:hashedPassword, Pw: Password});

      console.log(authUpdate);
      
      return '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña';

    } catch (err: any) {
      throw error(`${err.message}`, 409)
    }

  }

}