import { MailConfig } from "../../common/interfaces/config.config";


// Configuración principal
const config: MailConfig = {
    _host: process.env.MAIL_SRV_HOST || "smtp.gmail.com",
    _port: Number(process.env.MAIL_SRV_PORT) || 465,
    _secure: Boolean(process.env.MAIL_SRV_SECURE) || true,
    _user: process.env.MAIL_SRV_USER || "jorge010.b@gmail.com",
    _pass: process.env.MAIL_SRV_PASS || "zvjitrtxbwvbtvhk",
    //https://myaccount.google.com/lesssecureapps
    //https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4NxVEcMzN2op0acEcxjTR3vhgc3vycRASorbruuiW57JAXKYRySFc-vs4oG2lCtHENkv2sJ6OovNdGGvvSelieGEj2ApBgaDvYly3EjxAIqe3EHTi8    
};

export {config}; 