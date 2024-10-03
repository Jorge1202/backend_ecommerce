import { Router } from 'express';
import userController from '../Controllers/type_page.controller';

const userRoutes = Router();

userRoutes.get('/', userController.getAll);
userRoutes.get('/:id', userController.getById); // http://localhost:3000/api/v1/typePage/1

userRoutes.put('/:id', userController.updateById);

userRoutes.post('/', userController.create);

userRoutes.delete('/:id', userController.deleteById);

export default userRoutes;
  