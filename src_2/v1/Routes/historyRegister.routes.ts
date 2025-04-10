import { Router } from 'express';
import historyRegisterController from '../Controllers/historyRegister.controller';

const registerRoutes = Router();

//#region  ################ Generar cuenta  
/**
 * @swagger
 * /api/v1/history-register/:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Register]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
registerRoutes.post('/', historyRegisterController.create);
registerRoutes.get('/', historyRegisterController.validEmail);
registerRoutes.get('/validUsername', historyRegisterController.validUsername);
registerRoutes.put('/', historyRegisterController.updataRegister);

// registerRoutes.get('/:email', historyRegisterController.getById);
export default registerRoutes;