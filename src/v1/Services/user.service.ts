import { Transaction } from 'sequelize';
import { withTransaction } from '../../Database/transaction_helper';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { MailService, MailServiceConfig, MailActions } from '../../Mails/sendMail';
import { ServiceResponse, successResponse, errorResponse } from '../../Utils/Response/ServiceResponse';

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

  //#region ######################################### Metodos Public 
  //Obtener usuario por se usa para Auth
  public async findByPkUser_forAuth(id: string): Promise<ServiceResponse<User>> {
    try {
      const dataUser = await User.findByPk(id);
      if (!dataUser) {
        return errorResponse({
          statusCode: 422,
          message: 'No se encuentra registro con el identificador dado'
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Registro localizado.',  
        body: dataUser
      });


    } catch (err: any) {
      handleServiceError(err, 'findByPkUser_forAuth', err.statusCode);
    }
  }
  //#endregion ######################################### Metodos Public



  //#region ######################################### Metodos Protected 
  //Registro de usuarios
  protected async _registerUser(user: inUser): Promise<ServiceResponse<any>> {
    return await withTransaction(async (transaction) => {
      try {

        const responeValid = await this._validExite(user)
        if(responeValid.code != 200) return responeValid;
        
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

        if(!infoUserPage){
          return errorResponse({
            message: newUserPage.message,
            statusCode: newUserPage.statusCode,
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

        if(!resultAuth.error){
          return errorResponse({
            message: resultAuth.message,
            statusCode: resultAuth.statusCode,
          }); 
        }

        const {body} = resultAuth
        if (!body || !body.codeAuth) {
          return errorResponse({
            message: resultAuth.message,
            statusCode: resultAuth.statusCode,
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
        const responseMail = await mailService.send();
        // if(responseMail){}

        // 4. Crear autenticación
        const historyRegisterService = new HistoryRegisterService();
        await historyRegisterService.updateByRegister(user, transaction);

        const {auth} = body
        const token = generateToken({
          dataToken: {
            IdAuth: auth.IdAuth,
          },
          expiresIn: '30m',
        });

        return {
          code: 201,          
          message: {
            message: 'Usuario registrado exitosamente. ¡Verifica tu cuenta!',
            token
          }
        };

      } catch (err: any) {
        handleServiceError(err, '_registerUser', err.statusCode);
      }
    })

  }

  // Obtener usuario por ID
  protected async findByPkUser(id: string): Promise<ServiceResponse<User | string>> {
    try {
      const dataUser = await User.findByPk(id);
      if (!dataUser) {
        return errorResponse({
          statusCode: 422,
          message: 'No se encuentra registro con el identificador dado'
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Registro localizado.',
        body:dataUser
      });

    } catch (err: any) {
      handleServiceError(err, 'findByPkUser', err.statusCode);
    }
  }

  // Obtener todos los usuarios
  protected async _findAll(): Promise<ServiceResponse<User[]>> {
    try {
      const list = await User.findAll();

      return successResponse({
        statusCode: 200,
        message: 'Lista de Registros',
        body:list
      });

    } catch (err: any) {
      handleServiceError(err, '_findAll', 400)
    }
  }

  // Actualizar usuario
  protected async _updateUser(id: string, data: Partial<User>): Promise<ServiceResponse<User | null>> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return errorResponse({
          statusCode: 200,
          message: 'No se encuentra registro con el identificador dado'
        });
        
      }

      await user.update(data);
      return successResponse({
        statusCode: 200,
        message: 'Registro actualizado.',  
        body:user
      });

    } catch (err: any) {
      handleServiceError(err, '_updateUser', err.statusCode)
    }
  }

  // Eliminar usuario
  protected async _destroyUser(id: string): Promise<ServiceResponse<number>> {
    try {
      const result = await User.destroy({ where: { IdUser: id } });
      if (!result) {
        return errorResponse({
          statusCode: 422,
          message:  `No se encontro el registro`
        });
      }

      return successResponse({
        statusCode: 200,
        message: 'Registro eliminado.',  
        body:result
      });


    } catch (err: any) {
      handleServiceError(err, '_destroyUser', err.statusCode)
    }
  }

  protected async _pruebaMail(data: RegisterData): Promise<ServiceResponse<any>> {
    try {
      const { user } = data;

      const mailConfig: MailServiceConfig = {
        accion: MailActions.CodeAuth,
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

      return successResponse({
        statusCode: 200,
        message: 'Usuario registrado exitosamente. ¡Verifica tu cuenta!'
      });
      
    } catch (err: any) {
      handleServiceError(err, '_pruebaMail', err.statusCode)
    }
  }

  //#endregion ######################################### Metodos Protected



  //#region ######################################### Metodos Private 
  // Crear usuario
  private async _createUser(userData: UserCreationAttributes, transaction: Transaction): Promise<User> {
    try {
      return await User.create(userData, { transaction });
    } catch (err: any) {
      handleServiceError(err, '_createUser', 400)
    }
  }
  private async _validExite(user: inUser): Promise<any> {
    try {
      const userExit = await User.findOne({
        where: { Username: user.Username }
      })

      //Hace falta validar si tiene un codigo enviado o si se encuentra en estatus 

      if (userExit) {
      return { message: 'El usuario ya existe',  code: 409 }
      }

      const emailExit = await User.findOne({
        where: { Email: user.Email }
      })
      if (emailExit) {
      return { message: 'El email ya existe',  code:409 }
      }

    return { message: 'Los datos son validos',  code:200 }

    }
    catch (err: any) {
      handleServiceError(err, '_validExite', err.statusCode);
    }
  }
  //#endregion ######################################### Metodos Private

}
