import { Auth } from '../../../models/auth'; 

export class AuthService {
  protected async _findAll(): Promise<Auth[]> {
    try {      
      const list = await Auth.findAll();
      return list;
    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _findByPk(id: number): Promise<Auth | null> {
    try {
      const record = await Auth.findByPk(id); // Remover el include de User
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }
  

  protected async _create(data: Auth): Promise<Auth> {
    try {
      const newRecord = await Auth.create(data);
      return newRecord;
    } catch (error) {
      throw new Error(`Error creating record: ${error}`);
    }
  }

  protected async _update(id: number, data: Partial<Auth>): Promise<Auth | null> {
    try {
      const record = await Auth.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }
      await record.update(data);
      return record;
    } catch (error) {
      throw new Error(`Error updating record: ${error}`);
    }
  }

  protected async _destroy(id: number): Promise<number> {
    const result = await Auth.destroy({
      where: { IdAuth: id },
    });
    return result;
  }  
}
