import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
const cors = require('cors');

import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./core/docs/swagger";

import routes from './routes'; // tus rutas principales
import { accessLogStream } from './core/logger/access';

import { errorsMiddleware } from './common/middlewares/errors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './core/config/cors';
import { securityHelmet } from './core/config/helmet';
// import './types/express'; 

const app = express();

// Middleware de seguridad
securityHelmet(app)

// Middleware obtener cookies only-http
app.use(cookieParser())

// Middleware para permitir CORS
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Morgan para logs de peticiones HTTP (formato combinado + archivo)
app.use(morgan('combined', { stream: accessLogStream }));

// Rutas
app.use('/api', routes);

// Documentación Swagger
app.use("/api/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// Middleware de manejo de errores
app.use(errorsMiddleware);

export {app};