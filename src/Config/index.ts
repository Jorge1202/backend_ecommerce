// Definir tipos para la configuración
interface ApiConfig {
    PORT: number;
}

interface CORSConfig {
    origin: string | [string, string];
}
interface MailConfig {
    _host: string;
    _port: number;
    _secure: boolean;
    _user: string;
    _pass: string;
}

interface Config {
    api: ApiConfig;
    JWT_SECRET : string;
    CORS: CORSConfig;
    version: string
    URL_FRONTEND: string
    mail: MailConfig
}

// Configuración principal
const config: Config = {
    // version: process.env.API_VERSION  || 'v1',
    version: 'v1',
    URL_FRONTEND: process.env.SRV_HOST || "http://localhost:3000",
    JWT_SECRET: process.env.JWT_SECRET || 'notasecret',
    
    api: {
        PORT: Number(process.env.PORT) || 3005, // Convertimos a número para mayor seguridad
    },
    CORS: {
        origin: process.env.SRV_HOST || [
          "http://localhost:3000",
          "http://192.168.1.70:3000",
        ],
    },
    mail: {
        _host: process.env.MAIL_SRV_HOST || "smtp.gmail.com",
        _port: Number(process.env.MAIL_SRV_PORT) || 465,
        _secure: Boolean(process.env.MAIL_SRV_SECURE) || true,
        _user: process.env.MAIL_SRV_USER || "jorge010.b@gmail.com",
        _pass: process.env.MAIL_SRV_PASS || "zvjitrtxbwvbtvhk",
        //https://myaccount.google.com/lesssecureapps
        //https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4NxVEcMzN2op0acEcxjTR3vhgc3vycRASorbruuiW57JAXKYRySFc-vs4oG2lCtHENkv2sJ6OovNdGGvvSelieGEj2ApBgaDvYly3EjxAIqe3EHTi8
    },
};

export {config};  