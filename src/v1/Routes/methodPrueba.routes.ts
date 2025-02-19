import { Router } from 'express';
import methodPruebaController from '../Controllers//method_prueba.controller';

const registerRoutes = Router();

registerRoutes.get('/', methodPruebaController.methodPruebaErrores);
registerRoutes.post('/', methodPruebaController.sendMail);

// registerRoutes.get('/:email', historyRegisterController.getById);
export default registerRoutes;