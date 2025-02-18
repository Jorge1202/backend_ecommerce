import { Transaction } from 'sequelize';
import { Profile, ProfileCreationAttributes  } from '../models/profile'; 
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { StatisticsProfileService } from './statics_profile.service';
import { ServiceResult, successResult, errorResult } from '../../Utils/Response/ServiceResult';


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
  protected async _findAllProfile(): Promise<ServiceResult<Profile[]>> {
    try {      
      const list = await Profile.findAll();
      return successResult({
        status: 200,
        message: 'Registro localizado.',  
        body: list
      });

    } catch (err: any) {
      handleServiceError(err, '_findAllProfile', 400);
    }
  }

  protected async _findByPk(id: string): Promise<ServiceResult<Profile>> {
    try {
      const record = await Profile.findByPk(id); // Remover el include de User
      if (!record) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }
      
      return successResult({
        status: 200,
        message: 'Registro localizado.',  
        body:record
      });

    } catch (err:any) {
      handleServiceError(err, '_findByPk', err.statusCode)
    }
  }
  
  protected async _updateProfile(id: string, data: Partial<Profile>): Promise<ServiceResult<Profile>> {
    try {
      const record = await Profile.findByPk(id);
      if (!record) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }


      await record.update(data);
      return successResult({
        status: 200,
        message: 'Registro localizado.',
        body:record
      });

    } catch (err:any) {
      handleServiceError(err, '_updateProfile', err.statusCode)
    }
  }

  protected async _destroyProfile(id: string): Promise<ServiceResult<string>> {

    try {
      const result = await Profile.destroy({
        where: { IdProfile: id },
      });
  
      if (!result) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      } 
  
      return successResult({
        status: 200,
        message: 'Registro eliminado exitosamente.'
      });
      
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
