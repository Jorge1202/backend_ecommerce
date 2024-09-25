import { Transaction } from 'sequelize';
import { Profile, ProfileCreationAttributes  } from '../models/profile'; 

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
  

  protected async _create(data: Profile, transaction: Transaction ): Promise<Profile> {
    try {   
      const newRecord = await Profile.create(data, {transaction});
      return newRecord;
    } catch (error) {
      throw new Error(`Error creating record: ${error}`);
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
