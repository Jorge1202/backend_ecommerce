import { Main, Mail_DataObject, DataMail } from './mail'; // Asegúrate de importar el enum desde el archivo correcto
import { handleServiceError } from '../Utils/Response/handleServiceError';

export enum MailActions {
    CodeAuth = 'codeAuth_ValidEmail',
    BienvenidoAdmin = 'bienvenidoAdmin',
    NuevoDispositivo = 'nuevoDispositivo',
    FormularioContrato = 'formularioContrato',
    RecoveryPassword = 'recoveryPassword',
    PasswordChangeSuccessful = 'PasswordChangeSuccessful',
}
 
export interface MailServiceConfig {
    accion: MailActions;
    to: string;
    subject: string;
    dataMail: DataMail
}

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
                link: config.dataMail.link || '',
                code: config.dataMail.code || '',
                username: config.dataMail.username || '',
                token: config.dataMail.token || '',
            }
        };
    }

    private sendMail = async () => {
        try {
            // Llamada a la función main
            const success = await Main(this.dataObject);
            if (success) {
                return {send: true, response:'El correo se envió correctamente.'}
            } else {
                return {send: false, response:'Hubo un problema al enviar el correo.'} 
            }
        } catch (err: any) {
            handleServiceError(err, 'sendMail', err.status);
        }
    };

    // Método público para enviar el correo
    public async send() {
        return await this.sendMail();
    }
}
