import { Application } from 'express';
import helmet from 'helmet';

export const securityHelmet = (app: Application): void => {
    app.use(helmet());                                 // Usá una herramienta como https://securityheaders.com para analizar tu API. O podés ver las cabeceras en Postman / navegador:
    // app.use(helmet.dnsPrefetchControl());           // Controla dns-prefetch
    // app.use(helmet.frameguard({ action: 'deny' })); // Previene clickjacking
    // app.use(helmet.hidePoweredBy());                // Elimina el X-Powered-By
    // app.use(helmet.hsts());                         // Seguridad HTTPS Strict
    // app.use(helmet.noSniff());                      // No sniffing
    // app.use(helmet.xssFilter());                    // Previene XSS
};
  