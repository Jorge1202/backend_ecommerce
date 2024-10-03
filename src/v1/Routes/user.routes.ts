import { Router } from 'express';
import userController from '../Controllers/user.controller';
const userRoutes = Router();


userRoutes.post('/mail', userController.sendMail);
userRoutes.post('/', userController.create);

userRoutes.get('/', userController.getAll);
userRoutes.get('/:id', userController.getById); // http://localhost:3000/api/v1/typePage/1

userRoutes.put('/:id', userController.updateById);


userRoutes.delete('/:id', userController.deleteById);

export default userRoutes;  