//Configuración principal de la aplicación
import express, { Request, Response } from 'express';
import routes from './routes';
import error from '../middlewares/errors'; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//#region ROUTES

app.get("/", (req: Request, res: Response) => {
    res.send("Api");
});

app.get("/api", (req: Request, res: Response) => {
    res.send("Api documentacion...");
});


routes(app)
//#endregion ROUTES

// Middleware de manejo de errores
app.use(error);

export {app};
