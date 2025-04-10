import { Transaction, Sequelize } from 'sequelize';
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
import { Login } from '../models/login';
import { Auth } from '../models/auth';
import { maskEmail } from '../../Mails/maskEmail';

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
  //Obtener datos del usuario por id
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
  //#endregion ######################################### Metodos ServiceResponse 

  protected async _registerUser(user: inUser): Promise<ServiceResult<any>> {
    return await this._registerUser_pv(user)
  }
  private async _registerUser_pv(user: inUser): Promise<any> {
    return await withTransaction(async (transaction) => {
      try {

        // 1. Validación de datos
        const responeValid = await this._validExite(user)
        if (responeValid.code != 200) {
          throw errorResult({
            message: responeValid.message,
            status: responeValid.code,
          });
        } 


        // 2. Crear usuario
        const newUser = await User.create({
          Username: user.Username,
          Name: user.Name,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          Phone: user.Phone,
        }, { transaction });
        
        if (!newUser) {
          throw errorResult({
            message: 'Error al crear el usuario',
            status: 500,
          });
        }
  
        // 3. Crear autenticación        
        const authService = new AuthService();
        const resultAuth = await authService.createAuth({
          IdUser: newUser.IdUser,
          Username: user.Username,
          Password: user.Password,
          Pw: user.Password
        }, transaction);

        const { body, error} = resultAuth
        if (error) {
          throw errorResult({
            message: resultAuth.message,
            status: resultAuth.status,
          });
        }

        if (!body || !body.codeAuth) {
          throw errorResult({
            message: resultAuth.message,
            status: resultAuth.status,
          });
        }

        // 4. Envía el correo
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
        const { send, response } = await mailService.send();
        if (!send) {
          console.error('mailService.send()', response);
        }

        // 5. Actualiza estatus del historial de registro
        const historyRegisterService = new HistoryRegisterService();
        await historyRegisterService.updateByRegister(user, transaction);

        // 6. Genera token
        const { auth } = body
        const token = generateToken({
          dataToken: {
            IdAuth: auth.IdAuth,
          },
          expiresIn: '30m',
        });

        return successResult({
          status: 201,
          message: 'Usuario registrado exitosamente. ¡Verifica tu cuenta!',
          body: {
            token,
            maskEmail: maskEmail(user.Email),
            email: user.Email,
          }  //mandar email y email en mask
        });

      } catch (err: any) {
        handleServiceError(err, '_registerUser', 'UserService');
      }
    })
  }

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

}
