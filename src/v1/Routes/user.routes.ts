import { Router } from 'express';
import userController from '../Controllers/user.controller';
import { authenticateToken } from '../../Middlewares/authenticateToken ';
const userRoutes = Router();

// userRoutes.get('/:id', userController.getById); // http://localhost:3000/api/v1/typePage/1
userRoutes.get('/', authenticateToken, userController.getById);
userRoutes.get('/all', userController.getAll);
userRoutes.post('/', userController.create);
userRoutes.put('/:id', userController.updateById);
userRoutes.delete('/:id', userController.deleteById);

export default userRoutes;  