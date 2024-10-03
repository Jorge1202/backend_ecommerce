import { config } from '../../../Config';

import { MailActions } from './sendMail';
import { DataMail } from './mail';
import { template } from './content/template';
import { welcomeNewUser } from './content/welcomeNewUser';
import { cedeAuth } from './content/code_auth';
import { recoveryPass } from './content/recoveryPass';
import { PasswordChangeSuccessful } from './content/PasswordChangeSuccessful';
import { newDevice } from './content/newDevice';
import error from '../../../middlewares/error';

export const bodyMail = async (action: MailActions, params: DataMail): Promise<string> => {
  let body = '';
  const company = 'Clisvi';
  const linkFront = config.URL_FRONTEND;

  // Asegurar valores por defecto
  params.username = params.username ?? '';

  switch (action) {
    case MailActions.CodeAuth:
      body = cedeAuth({
        name: params.name,
        firstname: params.firstname,
        code: params.code || '',
        company: company,
      });
      break;
    case MailActions.BienvenidoAdmin:
      body = welcomeNewUser({
        name: params.name,
        firstname: params.firstname,
        username: params.username,
        code: params.code || '',
        company: company,
        linkFront: linkFront,
      });
      break;
    case MailActions.NuevoDispositivo:
      body = newDevice({
        name: params.name,
        firstname: params.firstname,
        code: params.code || '',
        company: company,
      });
      break;
    case MailActions.RecoveryPassword:
      body = recoveryPass({
        name: params.name,
        firstname: params.firstname,
        company: company,
        link: `${linkFront}/recoverypassword/${params.token}`
      });
      break;
    case MailActions.PasswordChangeSuccessful:
      body = PasswordChangeSuccessful({
        name: params.name,
        firstname: params.firstname,
        company: company,
      });
      break;
    default:
      console.log(`El el caso ${action} no se encuentra, Verifica el MailActions que envias`);
      
      throw error('Action not supported', 400)
  }

  return template(body, company);
};
