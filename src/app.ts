import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUI from "swagger-ui-express";
const cors = require('cors');

import routes from './routes'; // tus rutas principales
import swaggerSpec from "./core/config/swagger";
import { accessLogStream } from './core/logger/access';

// import './types/express'; 


const app = express();

// Middleware de seguridad
app.use(helmet());  //Usá una herramienta como https://securityheaders.com para analizar tu API. O podés ver las cabeceras en Postman / navegador:
// app.use(helmet.dnsPrefetchControl());       // Controla dns-prefetch
// app.use(helmet.frameguard({ action: 'deny' })); // Previene clickjacking
// app.use(helmet.hidePoweredBy());           // Elimina el X-Powered-By
// app.use(helmet.hsts());                    // Seguridad HTTPS Strict
// app.use(helmet.noSniff());                 // No sniffing
// app.use(helmet.xssFilter());               // Previene XSS

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Morgan para logs de peticiones HTTP (formato combinado + archivo)
app.use(morgan('combined', { stream: accessLogStream }));

// Rutas
app.use('/api', routes);


// Documentación Swagger
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export {app};