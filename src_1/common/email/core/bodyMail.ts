import { MailActions, DataMail } from '../../interfaces/mail';
import { template } from '../templates/v1/template';
import { welcomeNewUser } from '../templates/v1/welcome-new-user';
import { cedeAuth } from '../templates/v1/code-auth';
import { recoveryPass } from '../templates/v1/recovery-pass';
import { PasswordChangeSuccessful } from '../templates/v1/password-change-successful';
import { newDevice } from '../templates/v1/new-device';
import { ErrorResult } from '../../utils/response-servece/service-response';
import { config } from '../../../core/config';

export async function bodyMail(action: MailActions, params: DataMail): Promise<string> {
  const company = 'Clisvi';
  const linkFront = config.URL_FRONTEND;
  params.username = params.username ?? '';

  let body = '';

  switch (action) {
    case MailActions.CodeAuth:
      body = cedeAuth({ name: params.name, firstname: params.firstname, code: params.code, company });
      break;
    case MailActions.BienvenidoAdmin:
      body = welcomeNewUser({ ...params, company, linkFront });
      break;
    case MailActions.NuevoDispositivo:
      body = newDevice({ name: params.name, firstname: params.firstname, code: params.code, company });
      break;
    case MailActions.RecoveryPassword:
      body = recoveryPass({ ...params, company, link: `${linkFront}/newPassword/${params.token}` });
      break;
    case MailActions.PasswordChangeSuccessful:
      body = PasswordChangeSuccessful({ name: params.name, firstname: params.firstname, company });
      break;
    default:
      throw ErrorResult({ status: 400, message: 'Plantilla no soportada' });
  }
  return template(body, company);
}
