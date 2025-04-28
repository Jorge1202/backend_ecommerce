import { Router } from 'express';
import TestController from '../controllers/test.controller';

const registerRoutes = Router();


//#region  ################ Metodos de prueba   
registerRoutes.get('/history', TestController.listaHistory);


export default registerRoutes;

//#endregion ################ Metodos de prueba    