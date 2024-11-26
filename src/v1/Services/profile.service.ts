import { Transaction } from 'sequelize';
import { Profile, ProfileCreationAttributes  } from '../models/profile'; 
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { StatisticsProfileService } from './statics_profile.service';
import { StatisticsProfile } from '../models/statistics-profile';
import { ServiceResponse } from '../../Utils/ServiceResponse';


export class ProfileService {
  
  //#region ######################################### Metodos Public
  // Crear perfil de la página del usuario
  public async createProfile(profileData: ProfileCreationAttributes, transaction: Transaction): Promise<void> {
    try {

      const profile = await this._createProfile(profileData, transaction);
      
      const statisticsProfileService = new StatisticsProfileService()
      await statisticsProfileService.createStatics({
        IdProfile: profile.IdProfile,
      },transaction)
      
    } catch (err: any) {
      handleServiceError(err, 'createProfile', 400);
    } 
  }
  //#endregion ######################################### Metodos Public


  //#region ######################################### Metodos Protected
  protected async _findAllProfile(): Promise<ServiceResponse<Profile[]>> {
    try {      
      const list = await Profile.findAll();
      return {
        code: 200,
        isError: false,
        message: list
      };
    } catch (err: any) {
      handleServiceError(err, '_findAllProfile', 400);
    }
  }

  protected async _findByPk(id: string): Promise<ServiceResponse<Profile | string>> {
    try {
      const record = await Profile.findByPk(id); // Remover el include de User
      if (!record) {
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

    } catch (err:any) {
      handleServiceError(err, '_findByPk', err.statusCode)
    }
  }
  
  protected async _updateProfile(id: string, data: Partial<Profile>): Promise<ServiceResponse<Profile | string>> {
    try {
      const record = await Profile.findByPk(id);
      if (!record) {
        return {
          code: 422,
          isError: true,
          message: 'No se encuentra registro con el identificador dado'
        };
      }


      await record.update(data);
      return {
        code: 200,
        isError: false,
        message: record
      };

    } catch (err:any) {
      handleServiceError(err, '_updateProfile', err.statusCode)
    }
  }

  protected async _destroyProfile(id: string): Promise<ServiceResponse<string>> {

    try {
      const result = await Profile.destroy({
        where: { IdProfile: id },
      });
  
      if (!result) {
        return {
          code: 422,
          isError: true,
          message: 'Record not found'
        };
      } 
  
  
      return {
        code: 200,
        isError: false,
        message: 'Record  deleted successfully'
      };
      
    } catch (err:any) {
      handleServiceError(err, '_destroyProfile', err.statusCode)
    }


  }  
  //#endregion ######################################### Metodos Protected

  
  //#region ######################################### Metodos Private
  private async _createProfile(profileData: ProfileCreationAttributes, transaction: Transaction): Promise<Profile> {
    try {
      return await Profile.create(profileData, { transaction });
    } catch (err:any) {
      handleServiceError(err, '_createProfile', err.statusCode)
    }
  }
  //#endregion ######################################### Metodos Private
  
}
