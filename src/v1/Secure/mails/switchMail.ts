import { config } from '../../../Config';

import { MailActions } from './sendMail';
import { template } from './content/template';
import { welcomeNewUser } from './content/welcomeNewUser';
import { cedeAuth } from './content/code_auth';
import { recoveryPass } from './content/recoveryPass';
import { newDevice } from './content/newDevice';

interface Params {
  name: string;
  firstname: string;
  username?: string;
  code: string;
}

export const bodyMail = async (action: MailActions, params: Params): Promise<string> => {
  let body = '';
  const company = 'Clisvi';
  const link = config.URL_FRONTEND;

  // Asegurar valores por defecto
  params.username = params.username ?? '';

  switch (action) {
    case MailActions.CodeAuth:
      body = cedeAuth({
        name: params.name,
        firstname: params.firstname,
        code: params.code,
        company: company,
      });
      break;
    case MailActions.BienvenidoAdmin:
      body = welcomeNewUser({
        name: params.name,
        firstname: params.firstname,
        username: params.username,
        code: params.code,
        company: company,
        link: link,
      });
      break;
    case MailActions.NuevoDispositivo:
      body = newDevice({
        name: params.name,
        firstname: params.firstname,
        code: params.code,
        company: company,
      });
      break;
    case MailActions.RecoveryPass:
      body = recoveryPass({
        name: params.name,
        firstname: params.firstname,
        code: params.code,
        company: company,
      });
      break;
    default:
      throw new Error('Action not supported');
  }

  return template(body, company);
};
