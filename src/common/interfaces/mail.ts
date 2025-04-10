export enum MailActions {
    CodeAuth = 'codeAuth_ValidEmail',
    BienvenidoAdmin = 'bienvenidoAdmin',
    NuevoDispositivo = 'nuevoDispositivo',
    FormularioContrato = 'formularioContrato',
    RecoveryPassword = 'recoveryPassword',
    PasswordChangeSuccessful = 'PasswordChangeSuccessful',
}

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


export interface MailServiceConfig {
    accion: MailActions;
    to: string;
    subject: string;
    dataMail: DataMail
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