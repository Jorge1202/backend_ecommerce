import { Router } from 'express';
import AuthController from './controller';

const router = Router();

// Define las rutas y las acciones correspondientes
router.post('/auth', AuthController.findAll);
router.get('/auth/:id_auth', AuthController.findByPk);
router.put('/auth/:id_auth', AuthController.updateById);
router.delete('/auth/:id_auth', AuthController.deleteById);

export default router;

