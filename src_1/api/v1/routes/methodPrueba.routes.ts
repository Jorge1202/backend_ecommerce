import { Router } from 'express';
import NewUserController from '../controllers/register.controller';

const methodPruebaRoutes = Router();


//#region  ################ Generar cuenta  
methodPruebaRoutes.get('/history', NewUserController.listaHistory);

export default methodPruebaRoutes;