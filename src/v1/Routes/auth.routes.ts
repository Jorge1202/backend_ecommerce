import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();

// userRoutes.get('/', authController.getAll);
userRoutes.get('/:username/:password', authController.getByUsername); // http://localhost:3000/api/v1/typePage/1
// userRoutes.put('/:id', authController.updateById);
// userRoutes.delete('/:id', authController.deleteById);
// userRoutes.post('/', authController.create); //este metodo no se puede llamar por una solicitud HTTP

export default userRoutes;
  