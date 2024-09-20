import { Transaction } from 'sequelize';
import { User } from '../../../models/user'; 

export class UserService {
  protected async _findAll(): Promise<User[]> {
    try {      
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error obteniendo Users: ${error}`);
    }
  }

  protected async _findByPk(id: string): Promise<User | null> {
    try {
      const user = await User.findByPk(id); // Remover el include de User
      return user;
    } catch (error) {
      throw new Error(`Error obteniendo User con id ${id}: ${error}`);
    }
  }
  

  protected async _create(data: User, transaction: Transaction): Promise<User> {
    try {
      const newUser = await User.create(data,{transaction});
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  protected async _update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      await user.update(data);
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  protected async _destroy(id: string): Promise<number> {
    const result = await User.destroy({
      where: { IdUser: id },
    });
    return result;
  }  
}
