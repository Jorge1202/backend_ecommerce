import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResult, successResult, errorResult, throwServerError } from '../../Utils/Response/ServiceResult';
import { MailService, MailServiceConfig, MailActions } from '../../Mails/sendMail';

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
export class MethodPruebaService {
  //#region ######################################### Metodos Public
    protected async _pruebaMail(data: RegisterData): Promise<ServiceResult<any>> {
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
        const {send, response} = await mailService.send();
        if(!send){
            console.error('mailService.send()', response);     
        }

        return successResult({
            status: 200,
            message: 'prueba de mail'
        });

        } catch (err: any) {
        handleServiceError(err, '_pruebaMail', 'UserService')
        }
    }
    protected async _methodPruebaErrores(dataAuth:number): Promise<ServiceResult<any>> {
        try {
          if (dataAuth==1) {
            throw throwServerError({
              message: 'Error crítico para el flujo.',
              status: 409,
            });
    
            
          }
          if (dataAuth==2) {
            return errorResult({
              status: 400,
              message: `Error de sintaxis o datos incompletos o inválidos`
            });
          }
          
          return successResult({
            status: 200,
            message: 'Bienvenido',
            body: dataAuth
          });
    
        }  catch (err: any) {
          handleServiceError(err, '_methodPrueba', 'AuthService');
        }
    
    }
  //#region ######################################### Metodos Public
}