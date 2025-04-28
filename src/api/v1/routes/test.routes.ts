import { Router } from 'express';
import TestController from '../controllers/test.controller';

const registerRoutes = Router();


//#region  ################ Metodos de prueba   
registerRoutes.get('/history', TestController.listaHistory);
registerRoutes.get('/listAuth', TestController.getlistaAuth);


export default registerRoutes;

//#endregion ################ Metodos de prueba    