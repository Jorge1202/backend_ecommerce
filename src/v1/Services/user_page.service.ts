import { UserPage, UserPageCreationAttributes } from '../models/user-page';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import error from '../../middlewares/error';


export class UserPageService {

  public async createUserPage(userPageData: UserPageCreationAttributes, transaction: Transaction): Promise<UserPage> {
    try {
      return await UserPage.create(userPageData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating user page', 500)
    }
  }

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
    } catch (err) {
      throw error(`Error obteniendo el registro con USERNAME ${Username}: ${err}`);
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

  protected async _updateUserPage(id: number, data: Partial<UserPage>): Promise<UserPage | null> {
    try {
      const record = await UserPage.findByPk(id);
      if (!record) {
        throw error(`Record with id ${id} not found`);
      }

      await record.update(data);
      return record;
    } catch (err) {
      throw error(`Error actualizando registro con id ${id}: ${error}`);
    }
  }

}
