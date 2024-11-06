import { Router } from 'express';
import historyRegisterController from '../Controllers//historyRegister.controller';

const registerRoutes = Router();

registerRoutes.post('/', historyRegisterController.create);
registerRoutes.get('/', historyRegisterController.validEmail);
registerRoutes.get('/validUsername', historyRegisterController.validUsername);
registerRoutes.put('/', historyRegisterController.updataRegister);

// registerRoutes.get('/:email', historyRegisterController.getById);
export default registerRoutes;