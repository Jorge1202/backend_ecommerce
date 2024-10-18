import { Transaction } from 'sequelize';
import { withTransaction } from '../../Utils/transaction_helper';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { MailService, MailServiceConfig, MailActions } from '../Secure/mails/sendMail';
import error from '../../middlewares/error';

import { User, UserCreationAttributes } from '../models/user';

import {AuthService} from './auth.service';
import { UserPageService } from './user_page.service'
import { ProfileService } from './profile.service';
import { HistoryRegisterService } from './historyRegister.service';

interface inUser {
  Username: string;
  Name: string;
  Firstname: string;
  Lastname?: string;
  Email: string;
  Phone: string;
  Password: string;
}
interface RegisterData {
  user: inUser;
}
export class UserService {
  
  // Obtener usuario por ID
  public async findByPkUser(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (err) {
      throw error(`Error fetching user with id ${id}: ${err}`);
    }
  }

  //Registro de usuarios
  protected async _registerUser(data: RegisterData): Promise<any> {
    return await withTransaction(async (transaction)=>{
      try {
        const { user } = data;

        await this._validExite(user)
        
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
        const newUserPage = await userPageService.createUserPage({
          IdTypePage: 1,
          Username: user.Username,
          IdUser: newUser.IdUser,
        }, transaction);
  
        // 3. Crear perfil de la página del usuario
        const profileService = new ProfileService();
        await profileService.createProfile({
          Name: user.Name,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          Phone: user.Phone,
          IdUserPage: newUserPage.IdUserPage // Relación obligatoria
        }, transaction);
  
        // 4. Crear autenticación        
        const authService = new AuthService();
        const resultAuth =  await authService.createAuth({
          IdUser: newUser.IdUser,
          Username: user.Username,
          Password: user.Password, 
          Pw:user.Password
        }, transaction);

        // Envía el correo
        const mailConfig: MailServiceConfig = {
          accion:MailActions.CodeAuth,
          to: user.Email,
          subject: 'Código de verificación',
          dataMail: {
            name: user.Name,
            firstname: user.Firstname,
            code: resultAuth.codeAuth.Code ?? '',
          }
        };
        const mailService = new MailService(mailConfig);
        const responseMail = await mailService.send();
        // if(responseMail){}

        // 4. Crear autenticación
        const historyRegisterService = new HistoryRegisterService();          
        await historyRegisterService.updateByUsername (user.Email, user, transaction); 

        return {
          message: 'Usuario registrado exitosamente. ¡Verifica tu cuenta!'
        };

      } catch (err) {
        throw error(`Error registering user: ${err}`);
      }      
    })

  }

  private async _validExite(user:inUser):Promise<boolean | string>{
    try {
      const userExit = await User.findOne({
        where: {Username: user.Username}
      })

      //validar si tiene codigo enviado
      
      if(userExit){
        throw error('El usuario ya existe')
      }
      
      const emailExit = await User.findOne({
        where: {Email: user.Email}
      })
      if(emailExit){
        throw error('El email ya existe')
      }            
      return true
    } catch (err) {
      throw error('Error al crear registro')
    }
  }

  protected async _pruebaMail(data: RegisterData): Promise<any> {
      try {
        const { user } = data;

        const mailConfig: MailServiceConfig = {
          accion:MailActions.CodeAuth,
          to: user.Email,
          subject: 'Verifica tu cuenta',
          dataMail: {
            name: user.Name,
            firstname: user.Firstname,
            code: "456328",
            username: user.Username
          }
        };
        const mailService = new MailService(mailConfig);
        // Envía el correo
        const responseMail = await mailService.send();

        console.log(responseMail);
        
        return 'Usuario registrado exitosamente. ¡Verifica tu cuenta!';

      } catch (err) {
        throw error(`Error registering user: ${err}`);
      }
  }

  // Crear usuario
  private async _createUser(userData: UserCreationAttributes, transaction: Transaction): Promise<User> {
    try {
      return await User.create(userData, { transaction });
    } catch (err) {
      handleServiceError(error, 'Error creando usuario', 500)
    }
  }

  // Obtener todos los usuarios
  protected async _findAll(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (err) {
      handleServiceError(error, 'Error fetching users', 500)
    }
  }


  // Actualizar usuario
  protected async _updateUser(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw error(`User with id ${id} not found`);
      }
      await user.update(data);
      return user;
    } catch (err) {
      throw error(`Error updating user: ${err}`);
    }
  }

  // Eliminar usuario
  protected async _destroyUser(id: string): Promise<number> {
    try {
      return await User.destroy({ where: { IdUser: id } });
    } catch (err) {
      throw error(`Error deleting user: ${err}`);
    }
  }
}
