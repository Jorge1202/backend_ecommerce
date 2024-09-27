import { Transaction } from 'sequelize';
const bcrypt = require("bcrypt");
import { withTransaction } from '../../Utils/transaction_helper';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { MailService, MailServiceConfig, MailActions } from '../Secure/mails/sendMail';

import { User, UserCreationAttributes } from '../models/user';

import {AuthService} from './auth.service';
import { UserPageService } from './user_page.service'
import { ProfileService } from './profile.service';
import { HistoryRegisterService } from './historyRegister.service';

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

  //Registro de usuarios
  protected async registerUser(data: RegisterData): Promise<any> {
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
        const userPageService = new UserPageService();
        const newUserPage = await userPageService._createUserPage({
          IdTypePage: 1,
          Username: user.Username,
          IdUser: newUser.IdUser,
        }, transaction);
  
        // 3. Crear perfil de la página del usuario
        const profileService = new ProfileService();
        await profileService._createProfile({
          Name: user.Name,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          Phone: user.Phone,
          IdUserPage: newUserPage.IdUserPage // Relación obligatoria
        }, transaction);
  
        // 4. Crear autenticación
        const hashedPassword = await bcrypt.hash(user.Password, 10);
        const authService = new AuthService();
        const resultAuth =  await authService._createAuth({
          IdUser: newUser.IdUser,
          Username: user.Username,
          Password: hashedPassword, 
          Pw:user.Password
        }, transaction);


        // Envía el correo
        const mailConfig: MailServiceConfig = {
          accion:MailActions.CodeAuth,
          to: user.Email,
          subject: 'Verifica tu cuenta',
          name: user.Name,
          firstname: user.Firstname,
          code: resultAuth.codeAuth.Code ?? '',
          username: user.Username
        };
        const mailService = new MailService(mailConfig);
        const responseMail = await mailService.send();
        // if(responseMail){}

        // 4. Crear autenticación
        const historyRegisterService = new HistoryRegisterService();
        user.Password = hashedPassword
        await historyRegisterService._update (user.Email, user, transaction);



      } catch (err) {
        throw new Error(`Error registering user: ${err}`);
      }
      
    })
    return 'Usuario registrado exitosamente. ¡Verifica tu cuenta!';
  }

  protected async _pruebaMail(data: RegisterData): Promise<any> {
      try {
        const { user } = data;

        const mailConfig: MailServiceConfig = {
          accion:MailActions.CodeAuth,
          to: user.Email,
          subject: 'Verifica tu cuenta',
          name: user.Name,
          firstname: user.Firstname,
          code: "456328",
          username: user.Username
        };
        const mailService = new MailService(mailConfig);
        // Envía el correo
        const responseMail = await mailService.send();

        console.log(responseMail);
        
        return 'Usuario registrado exitosamente. ¡Verifica tu cuenta!';

      } catch (err) {
        throw new Error(`Error registering user: ${err}`);
      }
  }

  // Crear usuario
  private async _createUser(userData: UserCreationAttributes, transaction: Transaction): Promise<User> {
    try {
      return await User.create(userData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creando usuario', 500)
    }
  }

  // Obtener todos los usuarios
  protected async findAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      handleServiceError(error, 'Error fetching users', 500)
    }
  }

  // Obtener usuario por ID
  protected async findByPk(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw new Error(`Error fetching user with id ${id}: ${error}`);
    }
  }

  // Actualizar usuario
  protected async update(id: string, data: Partial<User>): Promise<User | null> {
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
  protected async destroy(id: string): Promise<number> {
    try {
      return await User.destroy({ where: { IdUser: id } });
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
}
