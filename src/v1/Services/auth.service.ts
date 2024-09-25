import { Auth, AuthCreationAttributes } from '../models/auth'; 
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';

export class AuthService {

  private async _createAuthentication(authData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(authData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }

  // protected async _create(data: Auth, transaction: Transaction): Promise<Auth> {
  //   try {   
  //     // data.DataCreate = new Date()   
  //     const newRecord = await Auth.create(data, {transaction});
  //     return newRecord;
  //   } catch (error) {
  //     throw new Error(`Error creating record: ${error}`);
  //   } 
  // }

  
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

  protected async _destroy(id: number): Promise<number> {
    const result = await Auth.destroy({
      where: { IdAuth: id },
    });
    return result;
  }  
}
