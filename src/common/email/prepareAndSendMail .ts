import { MailServiceConfig } from '../interfaces/mail';
import { MailService } from '../email';

export const prepareAndSendMail = async (dataMail:MailServiceConfig) =>{
    const {name, firstname, code, link,token, username,company, linkFront} = dataMail.dataMail

    const mailConfig: MailServiceConfig = {
        accion: dataMail.accion,
        to: dataMail.to,
        subject: dataMail.subject,
        dataMail: {
            name,
            firstname,
            code,
            link,
            token,
            username,
            company,
            linkFront,
        }
    };
    await MailService.send(mailConfig);
}