import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();

userRoutes.get('/:username/:password', authController.getLogin); 
userRoutes.get('/validtoken', authController.recoveryPasswordValid); 
userRoutes.put('/changePassword', authController.changePassword); 


export default userRoutes;
  