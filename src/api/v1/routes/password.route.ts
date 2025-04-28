import { Router } from 'express';
import PasswordController from '../controllers/password.controller';


const passwordRoutes = Router();

//#region ################ Solicitar cambio de contraseña 
passwordRoutes.post('/recovery', PasswordController.postRecovery);
passwordRoutes.get('/verifyToken', PasswordController.getVerifyToken);
passwordRoutes.post('/validCode', PasswordController.postValidCode);
passwordRoutes.put('/change', PasswordController.putChangePassword);
passwordRoutes.get('/newCode', PasswordController.getNewCode);
//#endregion ################ Solicitar cambio de contraseña 

export default passwordRoutes;
  