import { UserPage, UserPageCreationAttributes } from '../models/user-page';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { errorCatch } from '../../middlewares/error';
import { ServiceResponse } from '../../Utils/ServiceResponse';


export class UserPageService {

  //#region ######################################### Metodos Publicos
  public async createUserPage(userPageData: UserPageCreationAttributes, transaction: Transaction): Promise<UserPage> {
    try {
      const newRecord = await UserPage.create(userPageData, { transaction });
      if (!newRecord) {
        throw errorCatch('No se creo el registro', 500)
      }

      return newRecord;


    } catch (error) {
      handleServiceError(error, 'Error creating user page', 500)
    }
  }
  //#endregion ######################################### Metodos Publicos


  //#region ######################################### Metodos Protected
  protected async _findAll(): Promise<ServiceResponse<UserPage[]>> {
    try {      
      const list = await UserPage.findAll();
      return {
        code: 200,
        isError: false,
        message: list
      };

    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _findByPk(id: number): Promise<ServiceResponse<UserPage | string>> {
    try {
      const record = await UserPage.findByPk(id);
      if (record) {
        return {
          code: 409,
          isError: true,
          message: 'No se encuentra registro con el identificador dado'
        };
      }

      return {
        code: 200,
        isError: false,
        message: record
      };


    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }

  protected async _updateUserPage(id: number, data: Partial<UserPage>): Promise<ServiceResponse<UserPage | string>> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        return {
          code: 409,
          isError: true,
          message: `Record with id ${id} not found`
        };
      }

      await record.update(data);
      return {
        code: 200,
        isError: false,
        message: record
      };

    } catch (error) {
      throw new Error(`Error actualizando registro con id ${id}: ${error}`);
    }
  }
  //#endregion ######################################### Metodos Protected

}
