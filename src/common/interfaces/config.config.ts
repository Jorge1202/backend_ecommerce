interface ApiConfig {
    PORT: number;
}

interface CORS {
    origin: string | string[];
}


export interface Config {
    api: ApiConfig;
    JWT_SECRET : string;
    JWT_SECRET_REFRESH : string;
    CORS: CORS;
    version: string
    URL_FRONTEND: string
}


export interface MailConfig {
    _host: string;
    _port: number;
    _secure: boolean;
    _user: string;
    _pass: string;
}
