import { Transaction } from 'sequelize';
import { Profile, ProfileCreationAttributes  } from '../models/profile'; 
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { StatisticsProfileService } from './statics_profile.service';


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
      handleServiceError(err, 'createProfile', 'ProfileService');
    } 
  }
  //#endregion ######################################### Metodos Public
  
  //#region ######################################### Metodos Private
  private async _createProfile(profileData: ProfileCreationAttributes, transaction: Transaction): Promise<Profile> {
    try {
      return await Profile.create(profileData, { transaction });
    } catch (err:any) {
      handleServiceError(err, '_createProfile', 'ProfileService')
    }
  }
  //#endregion ######################################### Metodos Private
  
}
