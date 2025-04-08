import { SendMailOptions } from 'nodemailer';
import { Mail_DataObject, MailActions } from '../../interfaces/mail';
import { bodyMail } from './bodyMail';
import { ErrorResult } from '../../utils/response-servece/service-response';

export async function prepareMail(dataObject: Mail_DataObject): Promise<SendMailOptions> {
  const { accion, message, dataMail } = dataObject;

  if (!message.to || !message.subject) {
    throw ErrorResult({ status: 400, message: 'Faltan destinatario o asunto' });
  }

  message.from = message.from ?? '"Clisvi" <jorge010.b@gmail.com>';

  if (!Object.values(MailActions).includes(accion)) {
    throw ErrorResult({ status: 409, message: 'Acción no válida' });
  }

  const html = await bodyMail(accion, dataMail);

  const options: SendMailOptions = {
    from: message.from,
    to: message.to,
    subject: message.subject,
    html,
  };

  if (accion === MailActions.FormularioContrato) {
    options.attachments = [{
      path: './assets/pdf/Contrato.pdf',
      filename: 'ACOPIO-DE-INFORMACIÓN.pdf',
    }];
  }

  return options;
}
