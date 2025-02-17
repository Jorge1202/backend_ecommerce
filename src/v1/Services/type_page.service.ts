import { TypePage } from '../models/type-page'; 
import { ServiceResponse, successResponse, errorResponse } from '../../Utils/Response/ServiceResponse';
import { handleServiceError } from '../../Utils/Response/handleServiceError';


export class TypePageService {

  //#region ######################################### Metodos Protected
  protected async _findAll(): Promise<ServiceResponse<TypePage[]>> {
    try {      
      const list = await TypePage.findAll();
      return successResponse({
        statusCode: 200,
        message: 'Registro localizado.',  
        body: list
      });      

    } catch (err: any) {
      handleServiceError(err, '_findAll', err.statusCode);
    }  
  }

  protected async _findByPk(id: number): Promise<ServiceResponse<TypePage | string>> {
    try {
      const record = await TypePage.findByPk(id); // Remover el include de User
      if (!record) {
        return errorResponse({
          statusCode: 422,
          message: 'No se encuentra registro con el identificador dado',  
        }); 
      }
      
      return successResponse({
        statusCode: 200,
        message: 'Registro localizado.',  
        body: record
      }); 

    } catch (err: any) {
      handleServiceError(err, '_findByPk', err.statusCode);
    } 
  }
  
  protected async _createTypePage(data: TypePage): Promise<ServiceResponse<TypePage>> {
    try {
      const newRecord = await TypePage.create(data);
      if (!newRecord) {
        return errorResponse({
          statusCode: 400,
          message: 'No se creo el registro',  
        });
      }
      
      return successResponse({
        statusCode: 200,
        message: 'Registro creado.',  
        body: newRecord
      });




    } catch (err: any) {
      handleServiceError(err, '_createTypePage', err.statusCode);
    } 
  }

  protected async _updateTypePage(id: number, data: Partial<TypePage>): Promise<ServiceResponse<TypePage | string>> {
    try {
      const record = await TypePage.findByPk(id);
      if (!record) {
        return errorResponse({
          statusCode: 422,
          message:  `No se encontro el registro` 
        });
      }


      await record.update(data);
      return successResponse({
        statusCode: 200,
        message: 'Registro actualizado.',  
        body: record
      });
      
    } catch (err: any) {
      handleServiceError(err, '_updateTypePage', err.statusCode);
    } 
  }

  protected async _destroyTypePage(id: number): Promise<ServiceResponse<number>> {
    try {
      const result = await TypePage.destroy({
        where: { IdTypePage: id },
      });

      if (!result) {
        return errorResponse({
          statusCode: 422,
          message:  `No se encontro el registro` 
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Registro eliminado.',  
        body: result
      });
      
    } catch (err: any) {
      handleServiceError(err, '_destroyTypePage', err.statusCode);
    } 
  }  
  //#endregion ######################################### Metodos Protected


}
