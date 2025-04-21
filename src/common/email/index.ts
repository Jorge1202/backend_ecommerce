import { HttpStatus } from '../constants/httpStatus';
import { MailServiceConfig, Mail_DataObject } from '../interfaces/mail';
import { ErrorHandler } from '../utils/response-servece/error-handler';
import { ErrorResult, SuccessResult } from '../utils/response-servece/service-response';
import { MailProcessor } from './MailProcessor';


export class MailService extends MailProcessor {  
  private dataObject: Mail_DataObject;

  constructor(config: MailServiceConfig) {
    super();
    this.dataObject = {
      accion: config.accion,
      message: {
        to: config.to,
        subject: config.subject,
      },
      dataMail: {
        name: config.dataMail.name,
        firstname: config.dataMail.firstname,
        link: config.dataMail.link ?? '',
        code: config.dataMail.code ?? '',
        username: config.dataMail.username ?? '',
        token: config.dataMail.token ?? '',
      },
    };
  }

  // Método de entrada
  static async send(config: MailServiceConfig) {
    const service = new MailService(config);
    return await service.handleSend();
  }

  private async handleSend() {
    try {
      const success = await this.sendEmail(this.dataObject);

      if (!success) {
        return ErrorResult({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Hubo un problema al enviar el correo.',
        });
      }

      return SuccessResult({
        status: HttpStatus.OK,
        message: 'El correo se envió correctamente.',
        body: { send: true },
      });
    } catch (error: any) {
      ErrorHandler.handleServiceError(error, 'handleSend', 'MailService');
  }
  }
}
