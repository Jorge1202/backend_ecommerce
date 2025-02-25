import { Router } from 'express';
import methodPruebaController from '../Controllers/method_prueba.controller';
import { authenticateToken } from '../../Middlewares/authenticateToken '; 

const registerRoutes = Router();

registerRoutes.get('/pruebaErrors', authenticateToken, methodPruebaController.methodPruebaErrores);
registerRoutes.post('/sendMail',  methodPruebaController.sendMail);

export default registerRoutes;