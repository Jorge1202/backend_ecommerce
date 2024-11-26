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
        throw errorCatch('No se creo el registro', 400)
      }

      return newRecord;


    } catch (err: any) {
      handleServiceError(err, 'createUserPage', err.statusCode);
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

    } catch (err: any) {
      handleServiceError(err, 'createUserPage', 400);
    } 
  }

  protected async _findByPk(id: number): Promise<ServiceResponse<UserPage | string>> {
    try {
      const record = await UserPage.findByPk(id);
      if (record) {
        return {
          code: 422,
          isError: true,
          message: 'No se encuentra registro con el identificador dado'
        };
      }

      return {
        code: 200,
        isError: false,
        message: record
      };


    } catch (err: any) {
      handleServiceError(err, '_findByPk', 400);
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

    } catch (err: any) {
      handleServiceError(err, '_updateUserPage', 400);
    } 
  }
  //#endregion ######################################### Metodos Protected

}
