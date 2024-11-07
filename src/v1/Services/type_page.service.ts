import { TypePage } from '../models/type-page'; 
import { ServiceResponse } from '../../Utils/ServiceResponse';
import { errorCatch } from '../../middlewares/error';
import { handleServiceError } from '../../Utils/errorHandler_catch';


export class TypePageService {

  //#region ######################################### Metodos Protected
  protected async _findAll(): Promise<ServiceResponse<TypePage[]>> {
    try {      
      const list = await TypePage.findAll();
      return {
        code: 409,
        isError: true,
        message: list
      };

    } catch (err: any) {
      handleServiceError(err, '_findAll', err.statusCode);
    }  
  }

  protected async _findByPk(id: number): Promise<ServiceResponse<TypePage | string>> {
    try {
      const record = await TypePage.findByPk(id); // Remover el include de User
      if (!record) {
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

    } catch (err: any) {
      handleServiceError(err, '_findByPk', err.statusCode);
    } 
  }
  
  protected async _createTypePage(data: TypePage): Promise<ServiceResponse<TypePage>> {
    try {
      const newRecord = await TypePage.create(data);
      if (!newRecord) {
        throw errorCatch('No se creo el registro', 500)
      }
      
      return {
        code: 200,
        isError: false,
        message: newRecord
      };



    } catch (err: any) {
      handleServiceError(err, '_createTypePage', err.statusCode);
    } 
  }

  protected async _updateTypePage(id: number, data: Partial<TypePage>): Promise<ServiceResponse<TypePage | string>> {
    try {
      const record = await TypePage.findByPk(id);
      if (!record) {
        return {
          code: 409,
          isError: true,
          message: `No se encontro el registro`
        };
      }


      await record.update(data);
      return {
        code: 200,
        isError: false,
        message: record
      };
      
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
        return {
          code: 409,
          isError: true,
          message: `No se encontro el registro`
        };
      }

      return {
        code: 200,
        isError: false,
        message: result
      };
      
    } catch (err: any) {
      handleServiceError(err, '_destroyTypePage', err.statusCode);
    } 
  }  
  //#endregion ######################################### Metodos Protected


}
