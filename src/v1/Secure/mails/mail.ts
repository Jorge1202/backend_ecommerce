import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {config} from '../../../Config';
import error from '../../../middlewares/error';
import {bodyMail} from './switchMail';
import { MailActions } from './sendMail';

export interface DataMail {
  name:string
  firstname:string
  code?:string
  link?:string
  token?:string
  username?:string
  company?:string
  linkFront?:string
}

export interface Mail_DataObject {
  accion: MailActions;
  message: {
    from?: string;
    to: string;
    subject: string;
  };
  dataMail: DataMail;
}

// Inicializa el transportador de nodemailer
async function createTransporter(): Promise<Transporter> {
    const transportOptions: SMTPTransport.Options = {
      host: config.mail._host,  // Host SMTP
      port: config.mail._port,  // Puerto (ej. 465 o 587)
      secure: config.mail._secure, // Si es true usa SSL/TLS
      auth: {
        user: config.mail._user,  // Usuario de autenticación
        pass: config.mail._pass,  // Contraseña de autenticación
      },
    };
  
    return await nodemailer.createTransport(transportOptions);
}

// Verifica que el transportador esté listo para enviar correos
async function verifyTransporter(transporter: Transporter): Promise<void> {
  try {
    await transporter.verify();
    console.log('El servicio de correo está listo');
  } catch (err) {
    console.error('Error verificando el transportador de correo', err);
    throw error('No se ha podido verificar el servicio de correo.',500);
  }
}

// Prepara el correo electrónico
async function prepareMail(dataObject: Mail_DataObject): Promise<SendMailOptions> {
  const { accion, message, dataMail } = dataObject;

  // Validaciones básicas
  if (!message.to || !message.subject) {
    throw error('Faltan campos necesarios como destinatario o asunto', 400);
  }

  if (!message.from) {
    message.from = '"Clisvi" <jorge010.b@gmail.com>';
  }

    // Asegúrate de que la acción sea un valor de MailActions
    if (!Object.values(MailActions).includes(accion)) {
        throw new Error('Acción no válida');
    } 

    // Genera el contenido HTML basado en la acción
    const messagehtml = await bodyMail(accion, dataMail); 


  // Configuración del correo
  const infoMail: SendMailOptions = {
    from: message.from,
    to: message.to,
    subject: message.subject,
    html: messagehtml,
    // attachments: [
    //   {
    //     cid: 'logoUnuspat@1.ee',
    //     path: './assets/logos/logo-color.png',
    //     filename: 'unuspat_black.png',
    //   },
    //   {
    //     cid: 'logoUnuspat@2.ee',
    //     path: './assets/logos/logo-blanco.png',
    //     filename: 'unuspat_white.png',
    //   },
    // ],
  };

  // Agrega adjuntos específicos según la acción
  if (accion === MailActions.FormularioContrato) {
    infoMail.attachments?.push({
      path: './assets/pdf/Contrato.pdf',
      filename: 'ACOPIO-DE-INFORMACIÓN.pdf',
    });
  }

  return infoMail;
}

// Función principal para enviar el correo
export async function Main(dataObject: Mail_DataObject): Promise<boolean> {
  try {
    // Inicializa el transportador y verifica que esté listo
    const transporter = await createTransporter();
    await verifyTransporter(transporter);

    // Prepara el correo a enviar
    const mailOptions = await prepareMail(dataObject);

    // Envía el correo
    const info = await transporter.sendMail(mailOptions);

    // Valida la respuesta del servicio de correo
    if (info.response.includes('OK')) {
      console.log('Main response OK');
      return true;
    } else {
      throw error('No se ha podido enviar el correo.', 500);
    }
  } catch (err) {
    console.error('Error al enviar el correo:', err);
    throw err;
  }
}


// 4577 1755
// 5201 1659
// 5742 5012
// 9889 8610
// 3005 7491
// 8339 2064
// 8925 0917
// 8574 1963
// 2264 0318
// 4803 3277 