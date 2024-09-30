import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();

userRoutes.get('/:username/:password', authController.getLogin); 
userRoutes.post('/recoverypassword', authController.recoveryPassword);
userRoutes.get('/validarUser', authController.validDataUser); 
userRoutes.put('/changePassword', authController.changePassword); 

export default userRoutes;
  