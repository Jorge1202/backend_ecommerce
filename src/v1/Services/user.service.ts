import { Transaction } from 'sequelize';
import { withTransaction } from '../../Database/transaction_helper';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { MailService, MailServiceConfig, MailActions } from '../../Mails/sendMail';
import { ServiceResult, successResult, errorResult } from '../../Utils/Response/ServiceResult';

import { User, UserCreationAttributes } from '../models/user';

import { AuthService } from './auth.service';
import { UserPageService } from './user_page.service'
import { ProfileService } from './profile.service';
import { HistoryRegisterService } from './historyRegister.service';
import { generateToken } from '../../Secure/tokenJWT';

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

  //#region ######################################### Metodos ServiceResponse 
  //Obtener usuario por se usa para Auth
  public async findByPkUser_forAuth(id: string): Promise<ServiceResult<User>> {
    try {
      const dataUser = await User.findByPk(id);
      if (!dataUser) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 200,
        message: 'Registro localizado.',
        body: dataUser
      });


    } catch (err: any) {
      handleServiceError(err, 'findByPkUser_forAuth', 'UserService');
    }
  }

  //Registro de usuarios
  protected async _registerUser(user: inUser): Promise<ServiceResult<any>> {
    return await this._registerUser_pv(user)
  }

  // Obtener usuario por ID
  protected async findByPkUser(id: string): Promise<ServiceResult<User | string>> {
    try {
      const dataUser = await User.findByPk(id);
      if (!dataUser) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 200,
        message: 'Registro localizado.',
        body: dataUser
      });

    } catch (err: any) {
      handleServiceError(err, 'findByPkUser', 'UserService');
    }
  }

  // Obtener todos los usuarios
  protected async _findAll(): Promise<ServiceResult<User[]>> {
    try {
      const list = await User.findAll();

      return successResult({
        status: 200,
        message: 'Lista de Registros',
        body: list
      });

    } catch (err: any) {
      handleServiceError(err, '_findAll', 'UserService')
    }
  }

  // Actualizar usuario
  protected async _updateUser(id: string, data: Partial<User>): Promise<ServiceResult<User | null>> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });

      }

      await user.update(data);
      return successResult({
        status: 200,
        message: 'Registro actualizado.',
        body: user
      });

    } catch (err: any) {
      handleServiceError(err, '_updateUser', 'UserService')
    }
  }

  // Eliminar usuario
  protected async _destroyUser(id: string): Promise<ServiceResult<number>> {
    try {
      const result = await User.destroy({ where: { IdUser: id } });
      if (!result) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 200,
        message: 'Registro eliminado.',
        body: result
      });


    } catch (err: any) {
      handleServiceError(err, '_destroyUser', 'UserService')
    }
  }  
  //#endregion ######################################### Metodos ServiceResponse


  //#region ######################################### Metodos Private 
  /**
   * 
   * @param user 
   * @returns errorResult() o successResult()
   */
  private async _registerUser_pv(user: inUser): Promise<any> {
    return await withTransaction(async (transaction) => {
      try {

        const responeValid = await this._validExite(user)
        if (responeValid.code != 200) {
          throw errorResult({
            message: responeValid.message,
            status: responeValid.code,
          });
        }

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

        const infoUserPage = newUserPage.body

        if (!infoUserPage) {
          throw errorResult({
            message: newUserPage.message,
            status: newUserPage.status,
          });
        }

        await profileService.createProfile({
          Name: user.Name,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          Phone: user.Phone,
          IdUserPage: infoUserPage.IdUserPage // Relación obligatoria
        }, transaction);

        // 4. Crear autenticación        
        const authService = new AuthService();
        const resultAuth = await authService.createAuth({
          IdUser: newUser.IdUser,
          Username: user.Username,
          Password: user.Password,
          Pw: user.Password
        }, transaction);

        if (!resultAuth.error) {
          throw errorResult({
            message: resultAuth.message,
            status: resultAuth.status,
          });
        }

        const { body } = resultAuth
        if (!body || !body.codeAuth) {
          throw errorResult({
            message: resultAuth.message,
            status: resultAuth.status,
          });
        }

        // Envía el correo
        const mailConfig: MailServiceConfig = {
          accion: MailActions.CodeAuth,
          to: user.Email,
          subject: 'Código de verificación',
          dataMail: {
            name: user.Name,
            firstname: user.Firstname,
            code: body.codeAuth.Code ?? '',
          }
        };
        const mailService = new MailService(mailConfig);
        const {send, response} = await mailService.send();
        if(!send){
          console.error('mailService.send()', response);     
        }
        // if(responseMail){}

        // 4. Crear autenticación
        const historyRegisterService = new HistoryRegisterService();
        await historyRegisterService.updateByRegister(user, transaction);

        const { auth } = body
        const token = generateToken({
          dataToken: {
            IdAuth: auth.IdAuth,
          },
          expiresIn: '30m',
        });

        return successResult({
          status: 200,
          message: 'Usuario registrado exitosamente. ¡Verifica tu cuenta!',
          body: token
        });

      } catch (err: any) {
        handleServiceError(err, '_registerUser', 'UserService');
      }
    })
  }
  
  /**
   * 
   * @param userData 
   * @param transaction 
   * @returns {User}
   */
  private async _createUser(userData: UserCreationAttributes, transaction: Transaction): Promise<User> {
    try {
      return await User.create(userData, { transaction });
    } catch (err: any) {
      handleServiceError(err, '_createUser', 'UserService')
    }
  }

  /**
   * 
   * @param user 
   * @returns { message: '', code: 409 }
   */
  private async _validExite(user: inUser): Promise<any> {
    try {
      const userExit = await User.findOne({
        where: { Username: user.Username }
      })

      //Hace falta validar si tiene un codigo enviado o si se encuentra en estatus 

      if (userExit) {
        return { message: 'El usuario ya existe', code: 409 }
      }

      const emailExit = await User.findOne({
        where: { Email: user.Email }
      })
      if (emailExit) {
        return { message: 'El email ya existe', code: 409 }
      }

      return { message: 'Los datos son validos', code: 200 }

    }
    catch (err: any) {
      handleServiceError(err, '_validExite', 'UserService');
    }
  }
  //#endregion ######################################### Metodos Private

}
