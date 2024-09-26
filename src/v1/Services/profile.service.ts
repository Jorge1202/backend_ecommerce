import { Transaction } from 'sequelize';
import { Profile, ProfileCreationAttributes  } from '../models/profile'; 
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { StatisticsProfileService } from './statics_profile.service';
import { StatisticsProfile } from '../models/statistics-profile';

export class ProfileService {
  protected async _findAll(): Promise<Profile[]> {
    try {      
      const list = await Profile.findAll();
      return list;
    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _findByPk(id: string): Promise<Profile | null> {
    try {
      const record = await Profile.findByPk(id); // Remover el include de User
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }
  
  // Crear perfil de la página del usuario
  public async _createProfile(profileData: ProfileCreationAttributes, transaction: Transaction): Promise<void> {
    try {

      const profile = await this.createProfile(profileData, transaction);
      
      const statisticsProfileService = new StatisticsProfileService()
      await statisticsProfileService._createStatics({
        IdProfile: profile.IdProfile,
      },transaction)
      
    } catch (error) {
      handleServiceError(error, 'Error creating profile', 500)
    }
  }

  private async createProfile(profileData: ProfileCreationAttributes, transaction: Transaction): Promise<Profile> {
    try {
      return await Profile.create(profileData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating profile', 500)
    }
  }

  protected async _update(id: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      const record = await Profile.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }
      await record.update(data);
      return record;
    } catch (error) {
      throw new Error(`Error updating record: ${error}`);
    }
  }

  protected async _destroy(id: string): Promise<number> {
    const result = await Profile.destroy({
      where: { IdProfile: id },
    });
    return result;
  }  
}
