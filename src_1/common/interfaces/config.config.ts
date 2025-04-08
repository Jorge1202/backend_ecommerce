interface ApiConfig {
    PORT: number;
}

interface CORSConfig {
    origin: string | [string, string];
}


export interface Config {
    api: ApiConfig;
    JWT_SECRET : string;
    JWT_SECRET_REFRESH : string;
    CORS: CORSConfig;
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
