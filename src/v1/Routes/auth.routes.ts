import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();

userRoutes.get('/login', authController.login);
userRoutes.post('/recoverypassword', authController.recoveryPassword);
userRoutes.post('/validCodeByEmail', authController.validCodeByEmail); 

userRoutes.put('/changePassword', authController.changePassword); 

userRoutes.get('/validarUser', authController.validDataUser); 
userRoutes.get('/generateCodeEmail/:email', authController.generateCodeEmail); 
// userRoutes.get('/:username/:password', authController.getLogin); 

export default userRoutes;
  