import { Router } from 'express';
import historyRegisterController from '../Controllers//historyRegister.controller';

const registerRoutes = Router();

registerRoutes.post('/', historyRegisterController.create);
registerRoutes.put('/:id', historyRegisterController.updateById);
registerRoutes.get('/:id', historyRegisterController.getById);

export default registerRoutes;