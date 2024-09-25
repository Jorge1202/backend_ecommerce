// Definir tipos para la configuración
interface ApiConfig {
    PORT: number;
}

interface JwtConfig {
    secret: string;
}

interface CORSConfig {
    origin: string;
}

interface Config {
    api: ApiConfig;
    jwt: JwtConfig;
    CORS: CORSConfig;
    version: string
}

// Configuración principal
const config: Config = {
    // version: process.env.API_VERSION  || 'v1',
    version: 'v1',
    api: {
        PORT: Number(process.env.PORT) || 3005, // Convertimos a número para mayor seguridad
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret',
    },
    CORS: {
        origin: process.env.SRV_HOST || "http://localhost:3005",
    },
};

export {config};  