import { Main, Mail_DataObject } from './mail'; // Asegúrate de importar el enum desde el archivo correcto

export interface MailServiceConfig {
    accion: MailActions;
    to: string;
    subject: string;
    name: string;
    firstname: string;
    code: string;
    username: string;
}

export enum MailActions {
    CodeAuth = 'codeAuth',
    BienvenidoAdmin = 'bienvenidoAdmin',
    NuevoDispositivo = 'nuevoDispositivo',
    RecoveryPass = 'recoveryPass',
    FormularioContrato = 'formularioContrato'
}

export class MailService {
    private dataObject: Mail_DataObject;

    constructor(config: MailServiceConfig) {
        this.dataObject = {
            accion: MailActions.CodeAuth,
            message: {
                to: config.to,
                subject: config.subject,
            },
            dataMail: {
                name: config.name,
                firstname: config.firstname,
                code: config.code,
                username: config.username,
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
        } catch (error) {
            console.error('Error en la llamada a main:', error);
            return {send: false, response:`Error al enviar el correo`}  
        }
    };

    // Método público para enviar el correo
    public async send() {
        return await this.sendMail();
    }
}
