import { MailServiceConfig, Mail_DataObject } from '../interfaces/mail';
import { MailProcessor } from './MailProcessor';

export class MailService {
  private dataObject: Mail_DataObject;

  constructor(config: MailServiceConfig) {
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

  public async send() {
    const success = await MailProcessor.send(this.dataObject);
    return success
      ? { send: true, response: 'El correo se envió correctamente.' }
      : { send: false, response: 'Hubo un problema al enviar el correo.' };
  }
}