import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';

import { Auth, AuthCreationAttributes } from '../models/auth'; 
import { CodeAutentication } from '../models/code-autentication';

import { CodeAutenticationService } from './code_autentication.service';

interface AuthResult {
  auth: Auth; // Asumiendo que 'Auth' es el tipo que devuelve 'createAuth'
  codeAuth: CodeAutentication; // Asumiendo que 'CodeAuthentication' es el tipo que devuelve '_createCodeAuthentication'
}

export class AuthService {

  public async _createAuth(authData: AuthCreationAttributes, transaction: Transaction): Promise<AuthResult> {
    try {
      const auth = await this.createAuth(authData, transaction);

      const code_AutService = new CodeAutenticationService();
      const codeAuth = await code_AutService._createCodeAuthentication({
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

  private async createAuth(userData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(userData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }

  protected async _findAll(): Promise<Auth[]> {
    try {      
      const list = await Auth.findAll();
      return list;
    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _findByPk(id: number): Promise<Auth | null> {
    try {
      const record = await Auth.findByPk(id); // Remover el include de User
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }
  
  protected async _findByUsername(Username: string): Promise<Auth | null> {
    try {
      const record = await Auth.findOne({
        where: { Username } // Busca donde el campo 'username' coincida
      });
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con USERNAME ${Username}: ${error}`);
    }
  }

  protected async _update(id: number, data: Partial<Auth>): Promise<Auth | null> {
    try {
      const record = await Auth.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }
      await record.update(data);
      return record;
    } catch (error) {
      throw new Error(`Error updating record: ${error}`);
    }
  }
}