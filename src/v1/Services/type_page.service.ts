import { TypePage } from '../models/type-page'; 
import { ServiceResult, successResult, errorResult } from '../../Utils/Response/ServiceResult';
import { handleServiceError } from '../../Utils/Response/handleServiceError';


export class TypePageService {

  //#region ######################################### Metodos Protected
  protected async _findAll(): Promise<ServiceResult<TypePage[]>> {
    try {      
      const list = await TypePage.findAll();
      return successResult({
        status: 200,
        message: 'Registro localizado.',  
        body: list
      });      

    } catch (err: any) {
      handleServiceError(err, '_findAll', err.statusCode);
    }  
  }

  protected async _findByPk(id: number): Promise<ServiceResult<TypePage | string>> {
    try {
      const record = await TypePage.findByPk(id); // Remover el include de User
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
      handleServiceError(err, '_findByPk', err.statusCode);
    } 
  }
  
  protected async _createTypePage(data: TypePage): Promise<ServiceResult<TypePage>> {
    try {
      const newRecord = await TypePage.create(data);
      if (!newRecord) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
      
      return successResult({
        status: 200,
        message: 'Registro creado.',  
        body: newRecord
      });




    } catch (err: any) {
      handleServiceError(err, '_createTypePage', err.statusCode);
    } 
  }

  protected async _updateTypePage(id: number, data: Partial<TypePage>): Promise<ServiceResult<TypePage | string>> {
    try {
      const record = await TypePage.findByPk(id);
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
      handleServiceError(err, '_updateTypePage', err.statusCode);
    } 
  }

  protected async _destroyTypePage(id: number): Promise<ServiceResult<number>> {
    try {
      const result = await TypePage.destroy({
        where: { IdTypePage: id },
      });

      if (!result) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 200,
        message: 'Registro eliminado.',  
        body: result
      });
      
    } catch (err: any) {
      handleServiceError(err, '_destroyTypePage', err.statusCode);
    } 
  }  
  //#endregion ######################################### Metodos Protected


}
