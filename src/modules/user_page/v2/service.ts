import { UserPage, UserPageAttributes } from '../../../models/user-page';
import { TypePage } from '../../../models/type-page';
import { User } from '../../../models/user';
import { PageServices } from '../../../models/page-services';
import { PageStore } from '../../../models/page-store';
import { Profile } from '../../../models/profile';

export class UserPageService {
  protected async _getAllUserPages(): Promise<UserPage[]> {
    try {      
      const userPages = await UserPage.findAll();
      return userPages;
    } catch (error) {
      throw new Error(`Error obteniendo UserPages: ${error}`);
    }
  }

  protected async _getUserPageById(id: number): Promise<UserPage | null> {
    try {
      const userPage = await UserPage.findByPk(id, {
        include: [
          { model: TypePage },
          { model: User },
          { model: PageServices },
          { model: PageStore },
          { model: Profile },
        ],
      });
      return userPage;
    } catch (error) {
      throw new Error(`Error obteniendo UserPage con id ${id}: ${error}`);
    }
  }

  protected async _createUserPage(data: {
    IdUser: string;
    IdTypePage: number;
    Username: string;
  }): Promise<UserPage> {
    try {
      const userPage = await UserPage.create({
        IdUser: data.IdUser,
        IdTypePage: data.IdTypePage,
        Username: data.Username,
      });
      return userPage;
    } catch (error) {
      throw new Error(`Error creando UserPage: ${error}`);
    }
  }

  protected async _updateUserPage(id: number, data: Partial<UserPage>): Promise<UserPage | null> {
    try {
      const userPage = await UserPage.findByPk(id);
      if (!userPage) {
        throw new Error('UserPage no encontrado');
      }

      await userPage.update(data);
      return userPage;
    } catch (error) {
      throw new Error(`Error actualizando UserPage con id ${id}: ${error}`);
    }
  }

  protected async _deleteUserPage(id: number): Promise<number> {
    const result = await UserPage.destroy({
      where: { IdUserPage: id },
    });
    return result;
  }
}
