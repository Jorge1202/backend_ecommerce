import { UserPage, UserPageCreationAttributes } from '../models/user-page';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResponse, successResponse, errorResponse } from '../../Utils/Response/ServiceResponse';


export class UserPageService {

  //#region ######################################### Metodos Publicos
  public async createUserPage(userPageData: UserPageCreationAttributes, transaction: Transaction): Promise<ServiceResponse<UserPage>> {
    try {
      const newRecord = await UserPage.create(userPageData, { transaction });
      if (!newRecord) {
        return errorResponse({
          statusCode: 400,
          message: 'No se creo el registro'
        });
      }

      return successResponse({
        statusCode: 400,
        message: 'Registro creado',
        body: newRecord
      });



    } catch (err: any) {
      handleServiceError(err, 'createUserPage', err.statusCode);
    } 
  }
  //#endregion ######################################### Metodos Publicos


  //#region ######################################### Metodos Protected
  protected async _findAll(): Promise<ServiceResponse<UserPage[]>> {
    try {      
      const list = await UserPage.findAll();
        return successResponse({
          statusCode: 200,
          message: 'Lista de registros',  
          body: list
        });


    } catch (err: any) {
      handleServiceError(err, 'createUserPage', 400);
    } 
  }

  protected async _findByPk(id: number): Promise<ServiceResponse<UserPage>> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        return errorResponse({
          statusCode: 422,
          message: 'No se encuentra registro con el identificador dado'
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Registro localizado.',  
        body: record
      });
      
    } catch (err: any) {
      handleServiceError(err, '_findByPk', 400);
    } 
  }

  protected async _updateUserPage(id: number, data: Partial<UserPage>): Promise<ServiceResponse<UserPage | string>> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        return errorResponse({
          statusCode: 422,
          message: `No se encontro el registro` 
        });

        
      }

      await record.update(data);
      return successResponse({
        statusCode: 200,
        message: 'Registro actualizado.',  
        body: record
      });    

    } catch (err: any) {
      handleServiceError(err, '_updateUserPage', 400);
    } 
  }
  //#endregion ######################################### Metodos Protected

}
