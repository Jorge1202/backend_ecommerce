import { Transaction } from 'sequelize';
const bcrypt = require("bcrypt");
import { withTransaction } from '../../Utils/transaction_helper';
import { handleServiceError } from '../../Utils/errorHandler_catch';


import { User, UserCreationAttributes } from '../models/user';
import { UserPage, UserPageCreationAttributes } from '../models/user-page';
import { Auth, AuthCreationAttributes } from '../models/auth';
import { CodeAutentication } from '../models/code-autentication';
import { Profile, ProfileCreationAttributes } from '../models/profile';
import { CodeAutenticationCreationAttributes } from '../models/code-autentication';

import { AuthService } from './auth.service';

interface RegisterData {
  user: {
    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    Email: string;
    Phone: string;
    Password: string;
  };
}

export class UserService {

  protected async registerUser(data: RegisterData): Promise<void> {
    await withTransaction(async (transaction)=>{
      try {
        const { user } = data;
  
        // 1. Crear usuario
        const newUser = await this._createUser({
          Username: user.Username,
          Name: user.Name,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          Phone: user.Phone,
        }, transaction);
  
        // 2. Crear userPage
        const newUserPage = await this._createUserPage({
          IdTypePage: 1,
          Username: user.Username,
          IdUser: newUser.IdUser,
        }, transaction);
  
        // 3. Crear perfil de la página del usuario
        await this._createProfile({
          Name: user.Name,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          Phone: user.Phone,
          IdUserPage: newUserPage.IdUserPage // Relación obligatoria
        }, transaction);
  
        // 4. Crear autenticación
        const hashedPassword = await bcrypt.hash(user.Password, 10);
        const newAuthentication = await this._createAuthentication({
          IdUser: newUser.IdUser,
          Username: user.Username,
          Password: hashedPassword, 
          Pw:user.Password
        }, transaction);
  
        // 5. Crear código de autenticación
        await this._createCodeAuthentication({
          IdAuth: newAuthentication.IdAuth,
          Code: ''
        }, transaction);
  
      } catch (err) {
        throw new Error(`Error registering user: ${err}`);
      }

    })
  }

  // Crear usuario
  private async _createUser(userData: UserCreationAttributes, transaction: Transaction): Promise<User> {
    try {
      return await User.create(userData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creando usuario', 500)
    }
  }

  // Crear página del usuario
  private async _createUserPage(userPageData: UserPageCreationAttributes, transaction: Transaction): Promise<UserPage> {
    try {
      return await UserPage.create(userPageData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating user page', 500)
    }
  }

  // Crear perfil de la página del usuario
  private async _createProfile(profileData: ProfileCreationAttributes, transaction: Transaction): Promise<Profile> {
    try {
      return await Profile.create(profileData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating profile', 500)
    }
  }

  // Crear autenticación
  private async _createAuthentication(authData: AuthCreationAttributes, transaction: Transaction): Promise<Auth> {
    try {
      return await Auth.create(authData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication', 500)
    }
  }

  // Crear código de autenticación
  private async _createCodeAuthentication(codeData: CodeAutenticationCreationAttributes, transaction: Transaction): Promise<void> {
    try {

      await CodeAutentication.create(codeData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication code', 500)
    }
  }

  // Obtener todos los usuarios
  public async findAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      handleServiceError(error, 'Error fetching users', 500)
    }
  }

  // Obtener usuario por ID
  public async findByPk(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw new Error(`Error fetching user with id ${id}: ${error}`);
    }
  }

  // Actualizar usuario
  public async update(id: string, data: Partial<User>): Promise<User | null> {
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

  // Eliminar usuario
  public async destroy(id: string): Promise<number> {
    try {
      return await User.destroy({ where: { IdUser: id } });
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
}
