import { Router } from 'express';
import userController from '../Controllers/user.controller';
const userRoutes = Router();

userRoutes.post('/', userController.create);


export default userRoutes;  