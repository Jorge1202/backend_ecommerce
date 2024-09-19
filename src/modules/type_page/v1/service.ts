import { TypePage } from '../../../models/type-page'; 

export class TypePageService {
  protected async findAll(): Promise<TypePage[]> {
    try {      
      const users = await TypePage.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error obteniendo Users: ${error}`);
    }
  }

  protected async _findByPk(id: number): Promise<TypePage | null> {
    try {
      const user = await TypePage.findByPk(id); // Remover el include de User
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo User con id ${id}: ${error}`);
    }
  }
  

  protected async _create(data: TypePage): Promise<TypePage> {
    try {
      const newUser = await TypePage.create(data);
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  protected async _update(id: number, data: Partial<TypePage>): Promise<TypePage | null> {
    try {
      const user = await TypePage.findByPk(id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      await user.update(data);
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  protected async destroy(id: number): Promise<number> {
    const result = await TypePage.destroy({
      where: { IdTypePage: id },
    });
    return result;
  }  
}
