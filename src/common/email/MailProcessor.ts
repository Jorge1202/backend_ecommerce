import { Mail_DataObject } from '../interfaces/mail';
import { createTransporter } from './core/createTransporter';
import { verifyTransporter } from './core/verifyTransporter';
import { prepareMail } from './core/prepareMail';

export class MailProcessor {
  static async send(dataObject: Mail_DataObject): Promise<boolean> {
    try {
      const transporter = await createTransporter();
      await verifyTransporter(transporter);

      const mailOptions = await prepareMail(dataObject);
      const info = await transporter.sendMail(mailOptions);

      return info.response.includes('OK');
    } catch (error) {
      console.error('[MailProcessor] Error:', error);
      return false;
    }
  }
}
