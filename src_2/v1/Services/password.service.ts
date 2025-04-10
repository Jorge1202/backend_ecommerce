import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResult, successResult, errorResult, throwServerError } from '../../Utils/Response/ServiceResult';
import { MailService, MailServiceConfig, MailActions } from '../../Mails/sendMail';
import { TokenAuthUser } from '../../Secure/interfaceToken';
import { UserService } from './user.service';
import { User } from '../models/user';
import { Auth } from '../models/auth';
import { CodeAutenticationService } from './code_autentication.service';
import { generateToken } from '../../Secure/tokenJWT';
const bcrypt = require("bcrypt");


export class PasswordService {
  protected async _validCode(Code: string, dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
    try {

      const { IdUser } = dataToken
      if (!IdUser) {
        return errorResult({
          status: 400,
          message: `Token invalido`
        });
      }

      const userService = new UserService()
      const { body, status, message, error } = await userService.findByPkUser_forAuth(IdUser)
      if (!body || error) {
        return errorResult({
          status,
          message: message
        });
      }

      const authData = await Auth.findOne({
        where: { IdUser: body.IdUser }
      })
      if (!authData) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const code_AutService = new CodeAutenticationService();
      const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
      if (dataCode == 0) {
        return errorResult({
          status: 422,
          message: 'El Cóodigo incorrecto'
        });
      }

      const token = generateToken({
        dataToken: {
          IdUser: body.IdUser,
        },
        expiresIn: '30m',
      });



      return successResult({
        status: 200,
        message: `¡Código correcto! Puedes cambiar tu contraseña`,
        body: {
          token
        }
      });

    } catch (err: any) {
      handleServiceError(err, '_validCode', 'AuthService');
    }
  }
  protected async _changePassword(Password: string, dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
    try {

      const { IdUser } = dataToken
      if (!IdUser) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const userService = new UserService()
      const { body, error } = await userService.findByPkUser_forAuth(IdUser)

      if (error || !body) {
        return errorResult({
          status: 422,
          message: `Si existe una cuenta asociada con este correo, recibirás un email`
        });

      }

      const authUser = await Auth.findOne({
        where: { IdUser }
      })
      if (!authUser) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);
      authUser.Password = hashedPassword
      authUser.Pw = Password

      await authUser.save()

      // Envía el correo
      const mailConfig: MailServiceConfig = {
        accion: MailActions.PasswordChangeSuccessful,
        to: body.Email,
        subject: 'Confirmación de cambio de contraseña',
        dataMail: {
          name: body.Name,
          firstname: body.Firstname
        }
      };
      const mailService = new MailService(mailConfig);
      const responseMail = await mailService.send();
      if (!responseMail.send) {
        return errorResult({
          status: 422,
          message: responseMail.response
        });
      }

      return successResult({
        status: 200,
        message: '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña'
      });



    } catch (err: any) {
      handleServiceError(err, '_changePassword', 'AuthService');
    }

  }
  protected async _validDataUser(dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
    try {

      const { IdUser } = dataToken
      if (!IdUser) {
        return errorResult({
          message: `Token invalido`,
          status: 400,
        });
      }

      const authUser = await Auth.findOne({
        where: { IdUser }
      })
      if (!authUser) {
        throw throwServerError({
          message: 'No se encuentra el registro',
          status: 409,
        });
      }

      if (authUser.Status != 2 && authUser.Status != 3) {
        return errorResult({
          status: 422,
          message: 'El estatus de usuario no se encuentra en condiciones para solicitar el cambio de contraseña'
        });
      }

      return successResult({
        status: 200,
        message: 'Solicitud aprovada'
      });


    } catch (err: any) {
      handleServiceError(err, '_validDataUser', 'AuthService');
    }
  }

  protected async _recoveryPassword(Email: string): Promise<ServiceResult<any>> {
      try {
        const user = await User.findOne({
          where: { Email }
        });
        if (!user) {
          return errorResult({
            status: 422,
            message: `'Si existe una cuenta asociada con este correo, recibirás un email'`
          });
        }
  
        const auth = await Auth.findOne({
          where: { IdUser: user.IdUser }
        })
        if (!auth) {
          throw throwServerError({
            message: 'No se encuentra el registro',
            status: 409,
          });
        }
  
        const code_AutService = new CodeAutenticationService();
        const codeAuth = await code_AutService.createNewwCode({
          IdAuth: auth.IdAuth,
          IdTypeCode: 3
        });
  
        const token = generateToken({
          dataToken: {
            IdUser: user.IdUser,
          },
          expiresIn: '30m',
        });
  
        // Envía el correo
        const mailConfig: MailServiceConfig = {
          accion: MailActions.RecoveryPassword,
          to: user.Email,
          subject: 'Solicitud de cambio de contraseña',
          dataMail: {
            name: user.Name,
            firstname: user.Firstname,
            token: token,
            code: codeAuth.Code ?? '',
          }
        };
  
        const mailService = new MailService(mailConfig);
        const responseMail = await mailService.send();
        if (!responseMail.send) {
          throw throwServerError({
            status: 409,
            message: responseMail.response
          });
        }
  
        return successResult({
          status: 200,
          message: `¡Solicitud aprovada!, Accede al correo (${Email}) para seguir el proceso`,
          body: {
            token,
            infoUsuario: {
              Name: user.Name,
              Firstname: user.Firstname
            },
          }
        });
  
  
      } catch (err: any) {
        handleServiceError(err, '_recoveryPassword', 'AuthService');
      }
    }
}