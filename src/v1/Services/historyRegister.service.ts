import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { HistoryRegister } from '../models/history-register';
import { Transaction, Op } from 'sequelize';
import { ServiceResult, successResult, errorResult } from '../../Utils/Response/ServiceResult';

export class HistoryRegisterService {

  //#region ######################################### Metodos Public
  // Actualizar historial de registro (con o sin transacción)
  public async updateByRegister( data: Partial<HistoryRegister>, transaction?: Transaction ): Promise<ServiceResult<HistoryRegister>> {

    try {

      if(!data){
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      const isUnique = await this._findByID(data.Id || 0);
      if (!isUnique) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
      
      if (transaction) {
        //Aqui entra unicamente de user.service
        await isUnique.update({ ...data, StatusRegister: 6}, { transaction });
      } else {        
        await isUnique.update(data);
      }
      
      return successResult({
        status: 200,
        message: '',
        body: isUnique
      });

    } catch (err: any) {
      handleServiceError(err, 'updateByRegister', err.statusCode);
    }
  }
  //#endregion ######################################### Metodos Public
  
  
  //#region ######################################### Metodos Protected
    // Crear historial de registro
  protected async _createHistory(userData: HistoryRegister): Promise<ServiceResult<HistoryRegister>> {
    try {
      if(!userData.Email) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
      
      const existingRecord = await this._findByEmail(userData.Email);
      if (existingRecord) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      //Hace falta validar si tiene un codigo enviado o si se encuentra en estatus 6 202
      // const ValidCodeRecord = await this._findByEmail(userData.Email);
      // if (ValidCodeRecord) {
      //   return {
      //       code: 202,
      //       isError: true,
      //       message: '¡La cuenta requiere de verificación!, Consulta tu correo para ingresar el código de verificación'
      //   };
      // }

      const createdRecord = await HistoryRegister.create(userData);
      return successResult({
        status: 201,
        message: 'Registro fue creado',
        body: createdRecord
      });

    } catch (error: any) {
      handleServiceError(error, '_createHistory', error.statusCode);
    }
  }

  protected async valid_Email (Email:string): Promise<ServiceResult<HistoryRegister>> {
    try {
      if(!Email) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
  
      const existingRecord = await this._findByEmail(Email);
      if (existingRecord) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
  
      return successResult({
        status: 200,
        message: 'El correo está disponible'
      });
    
    } catch (err: any) {
      handleServiceError(err, 'valid_Email', err.statusCode);
    }

  }
  protected async valid_EmailwhithID (Email:string, Id:number): Promise<ServiceResult<HistoryRegister>> {
    try {
      if(!Email) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
  
      const isUnique = await this._isEmailUniqueForOtherId(Email, Id);
      if (isUnique) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
  
      return successResult({
        status: 200,
        message: 'El correo está disponible'
      });
      
    } catch (error: any) {
      handleServiceError(error, 'valid_EmailwhithID', error.statusCode);
    }

  }
  protected async _isEmailUniqueForOtherId(Email: string, id: number): Promise<HistoryRegister | null> {
    try {
        const existingRecord = await HistoryRegister.findOne({
            where: {
                Email,               // Busca donde el campo 'Email' coincida
                Id: { [Op.ne]: id }  // Y el id sea diferente al que estás actualizando
            }
        });
        
        return existingRecord;
    } catch (error: any) {
      handleServiceError(error, '_isEmailUniqueForOtherId', error.statusCode);
    }
  }

  protected async valid_Username (Username:string): Promise<ServiceResult<HistoryRegister>> {
    try {
      const existingRecord = await this._findByUsername(Username);
      if (existingRecord) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
  
      return successResult({
        status: 200,
        message: 'El username está disponible'
      });

    } catch (error: any) {
      handleServiceError(error, 'valid_Username', error.statusCode);
    }

  }
  protected async valid_UsernamewhithID (Username:string, Id:number): Promise<ServiceResult<HistoryRegister>> {
    try {
      if(!Username) {
        return errorResult({
          message: 'Es necesario el campo de username',
          status: 409,
        });
      }
  
      const isUnique = await this._isUsernameUniqueForOtherId(Username, Id);
      if (isUnique) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
  
      return successResult({
        status: 200,
        message: 'El Username está disponible'
      });
    
    } catch (error: any) {
      handleServiceError(error, 'valid_UsernamewhithID', error.statusCode);
    }

  }
  protected async _isUsernameUniqueForOtherId(Username: string, id: number): Promise<HistoryRegister | null> {
    try {
        const existingRecord = await HistoryRegister.findOne({
            where: {
                Username,            // Busca donde el campo 'Email' coincida
                Id: { [Op.ne]: id }  // Y el id sea diferente al que estás actualizando
            }
        });
        
        return existingRecord;
    } catch (error: any) {
      handleServiceError(error, '_isUsernameUniqueForOtherId', error.statusCode);
    }    
  }

  // Obtener historial de registro por Email
  protected async _findByEmail(Email: string): Promise<HistoryRegister | null> {
    try {
      return await HistoryRegister.findOne({
        where: { Email } // Busca donde el campo 'Email' coincida
      });
    } catch (error: any) {
      handleServiceError(error, '_findByEmail', 400);
    } 
  }
  // Obtener historial de registro por Username
  protected async _findByUsername(Username: string): Promise<HistoryRegister | null> {
    try {
      return await HistoryRegister.findOne({
        where: { Username }
      });
    } catch (error: any) {
      handleServiceError(error, '_findByUsername', 400);
    } 
  }
  // Obtener historial de registro por Id
  protected async _findByID(Id: number): Promise<HistoryRegister | null> {
    try {
      return await HistoryRegister.findOne({
        where: { Id }
      });
    } catch (error: any) {
      handleServiceError(error, '_findByID', 400);
    } 
  }
  //#endregion ######################################### Metodos Protected
  
}
