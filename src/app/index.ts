//Configuración principal de la aplicación
import express, { Request, Response } from 'express';
const cors = require('cors');

import routes from './routes';
import error from '../middlewares/errors_app'; 
import cookieParser from 'cookie-parser';
const app = express();

import { config } from '../Config';

//#region CORS
const corsOptions = {
    origin: config.CORS.origin, // Permite solicitudes desde tu frontend en localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'deviceToken'], // Encabezados permitidos
    credentials: true, // Si necesitas enviar cookies o cabeceras de autenticación
    optionsSuccessStatus: 200 // Para algunos navegadores antiguos (como IE)
};

app.use(cors(corsOptions));
//#endregion

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//#region ROUTES
app.get("/", (req: Request, res: Response) => {
    res.send("Api");
});

app.get("/api", (req: Request, res: Response) => {
    res.send("Api documentacion...");
});

app.use(cookieParser());

routes(app)
//#endregion ROUTES

// Middleware de manejo de errores
app.use(error);

export {app};
