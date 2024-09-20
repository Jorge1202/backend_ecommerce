import { UserPage } from '../../../models/user-page';
import { Transaction } from 'sequelize';

export class UserPageService {
  protected async _findAll(): Promise<UserPage[]> {
    try {      
      const list = await UserPage.findAll();
      return list;
    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _findByUsername(Username: string): Promise<UserPage | null> {
    try {
      const record = await UserPage.findOne({
        where: { Username } // Busca donde el campo 'username' coincida
      });
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con USERNAME ${Username}: ${error}`);
    }
  }

  protected async _findByPk(id: number): Promise<UserPage | null> {
    try {
      const record = await UserPage.findByPk(id);
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }

  protected async _create(data: {
    IdUser: string;
    IdTypePage: number;
    Username: string;
  }, transaction: Transaction): Promise<UserPage> {
    try {
      const newRecord = await UserPage.create({
        IdUser: data.IdUser,
        IdTypePage: data.IdTypePage,
        Username: data.Username,
      }, {transaction});
      return newRecord;
    } catch (error) {
      throw new Error(`Error creating record: ${error}`);
    }
  }

  protected async _update(id: number, data: Partial<UserPage>): Promise<UserPage | null> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }

      await record.update(data);
      return record;
    } catch (error) {
      throw new Error(`Error actualizando registro con id ${id}: ${error}`);
    }
  }

  protected async _destroy(id: number): Promise<number> {
    const result = await UserPage.destroy({
      where: { IdUserPage: id },
    });
    return result;
  }
}
