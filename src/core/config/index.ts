import { Config } from "../../common/interfaces/config";

// Configuración principal
const config: Config = {
    // version: process.env.API_VERSION  || 'v1',
    version: 'v1',
    URL_FRONTEND: process.env.SRV_HOST || "http://localhost:3000",
    JWT_SECRET: process.env.JWT_SECRET || 'notasecret',
    JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH || 'EsMiSecretRefresh',
    
    api: {
        PORT: Number(process.env.PORT) || 3005, // Convertimos a número para mayor seguridad
    },
};

export {config};  