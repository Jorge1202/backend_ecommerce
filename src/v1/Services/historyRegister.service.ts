import {errorCatch} from '../../middlewares/error';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { HistoryRegister } from '../models/history-register';
import { Transaction, Op } from 'sequelize';
import { ServiceResponse } from '../../Utils/ServiceResponse';

export class HistoryRegisterService {

  //#region ######################################### Metodos Public
  // Actualizar historial de registro (con o sin transacción)
  public async updateByRegister( data: Partial<HistoryRegister>, transaction?: Transaction ): Promise<ServiceResponse<HistoryRegister>> {

    try {

      if(!data){
        throw errorCatch('No hay datos para actualizar', 422)
      }


      const isUnique = await this._findByID(data.Id || 0);
      if (!isUnique) {
        return {
            code: 422,
            isError: true,
            message: 'El correo ya está registrado'
        };
      }
      
      if (transaction) {
        //Aqui entra unicamente de user.service
        await isUnique.update({ ...data, StatusRegister: 6}, { transaction });
      } else {        
        await isUnique.update(data);
      }
      
      return {
        code: 200,
        isError: false,
        message: isUnique,
      };


    } catch (err: any) {
      handleServiceError(err, 'updateByRegister', err.statusCode);
    }
  }
  //#endregion ######################################### Metodos Public
  
  
  //#region ######################################### Metodos Protected
    // Crear historial de registro
  protected async _createHistory(userData: HistoryRegister): Promise<ServiceResponse<HistoryRegister>> {
    try {
      if(!userData.Email) {
        throw errorCatch('El campo "Email" es obligatorio', 409);
      }
      
      const existingRecord = await this._findByEmail(userData.Email);
      if (existingRecord) {
        return {
            code: 409,
            isError: true,
            message: 'El correo ya está registrado'
        };
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
      return {
          code: 201,
          isError: false,
          message: createdRecord,
      };

    } catch (error: any) {
      handleServiceError(error, '_createHistory', error.statusCode);
    }
  }

  protected async valid_Email (Email:string): Promise<ServiceResponse<HistoryRegister>> {
    try {
      if(!Email) {
        throw errorCatch('El campo "Email" es obligatorio', 409);
      }
  
      const existingRecord = await this._findByEmail(Email);
      if (existingRecord) {
        return {
            code: 409,
            isError: true,
            message: 'El correo ya está registrado'
        };
      }
  
      return {
          code: 200,
          isError: false,
          message: 'El correo está disponible'
      };      
    } catch (err: any) {
      handleServiceError(err, 'valid_Email', err.statusCode);
    }

  }
  protected async valid_EmailwhithID (Email:string, Id:number): Promise<ServiceResponse<HistoryRegister>> {
    try {
      if(!Email) {
        throw errorCatch('El campo "Email" es obligatorio', 409);
      }
  
      const isUnique = await this._isEmailUniqueForOtherId(Email, Id);
      if (isUnique) {
        return {
            code: 409,
            isError: true,
            message: 'El correo ya está registrado'
        };
      }
  
      return {
          code: 200,
          isError: false,
          message: 'El correo está disponible'
      };
      
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

  protected async valid_Username (Username:string): Promise<ServiceResponse<HistoryRegister>> {
    try {
      const existingRecord = await this._findByUsername(Username);
      if (existingRecord) {
        return {
            code: 409,
            isError: true,
            message: 'El username ya está registrado'
        };
      }
  
      return {
          code: 200,
          isError: true,
          message: 'El username está disponible'
      };      
    } catch (error: any) {
      handleServiceError(error, 'valid_Username', error.statusCode);
    }

  }
  protected async valid_UsernamewhithID (Username:string, Id:number): Promise<ServiceResponse<HistoryRegister>> {
    try {
      if(!Username) {
        throw errorCatch('El campo "Username" es obligatorio', 409);
      }
  
      const isUnique = await this._isUsernameUniqueForOtherId(Username, Id);
      if (isUnique) {
        return {
            code: 409,
            isError: true,
            message: 'El Username ya está registrado'
        };
      }
  
      return {
          code: 200,
          isError: false,
          message: 'El Username está disponible'
      };      
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
  
  
  //#region ######################################### Metodos Private
  //#endregion ######################################### Metodos Private

  
}
