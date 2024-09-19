import { Router } from 'express';
import userController from './controller';

const userRoutes = Router();

userRoutes.get('/', userController.getAllUser);
userRoutes.get('/:id', userController.getUserById); // http://localhost:3000/api/v1/typePage/1
userRoutes.put('/:id', userController.updateUser);
userRoutes.delete('/:id', userController.deleteUser);
userRoutes.post('/', userController.createUser);

export default userRoutes;
  