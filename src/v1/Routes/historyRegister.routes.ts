import { Router } from 'express';
import historyRegisterController from '../Controllers//historyRegister.controller';

const registerRoutes = Router();

registerRoutes.post('/', historyRegisterController.create);
registerRoutes.put('/:email', historyRegisterController.updateById);
registerRoutes.get('/:email', historyRegisterController.getById);

export default registerRoutes;