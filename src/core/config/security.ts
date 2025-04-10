import { Config } from '../../common/interfaces/config.config';

const config: Config = {
  version: 'v1',

  URL_FRONTEND: process.env.SRV_HOST || 'http://localhost:3000',

  JWT_SECRET: process.env.JWT_SECRET || 'notasecret',
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH || 'EsMiSecretRefresh',

  api: {
    PORT: Number(process.env.PORT) || 3005,
  },

  CORS: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://192.168.1.70:3000',
    ],
  },
};

export { config };
