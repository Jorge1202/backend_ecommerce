import { UserPage, UserPageCreationAttributes } from '../models/user-page';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResult, successResult, errorResult } from '../../Utils/Response/ServiceResult';


export class UserPageService {

  //#region ######################################### Metodos Publicos
  public async createUserPage(userPageData: UserPageCreationAttributes, transaction: Transaction): Promise<ServiceResult<UserPage>> {
    try {
      const newRecord = await UserPage.create(userPageData, { transaction });
      if (!newRecord) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 400,
        message: 'Registro creado',
        body: newRecord
      });



    } catch (err: any) {
      handleServiceError(err, 'createUserPage', err.statusCode);
    } 
  }
  //#endregion ######################################### Metodos Publicos


  //#region ######################################### Metodos Protected
  protected async _findAll(): Promise<ServiceResult<UserPage[]>> {
    try {      
      const list = await UserPage.findAll();
        return successResult({
          status: 200,
          message: 'Lista de registros',  
          body: list
        });


    } catch (err: any) {
      handleServiceError(err, 'createUserPage', 400);
    } 
  }

  protected async _findByPk(id: number): Promise<ServiceResult<UserPage>> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 200,
        message: 'Registro localizado.',  
        body: record
      });
      
    } catch (err: any) {
      handleServiceError(err, '_findByPk', 400);
    } 
  }

  protected async _updateUserPage(id: number, data: Partial<UserPage>): Promise<ServiceResult<UserPage | string>> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });

        
      }

      await record.update(data);
      return successResult({
        status: 200,
        message: 'Registro actualizado.',  
        body: record
      });    

    } catch (err: any) {
      handleServiceError(err, '_updateUserPage', 400);
    } 
  }
  //#endregion ######################################### Metodos Protected

}
