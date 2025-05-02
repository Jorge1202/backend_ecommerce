import { Router } from 'express';
import { authenticateToken, decodeTokenEvenIfExpired } from '../../../common/middlewares/auth.middleware';
import PasswordController from '../controllers/password.controller';


const passwordRoutes = Router();

//#region ################ Solicitar cambio de contraseña 
passwordRoutes.post('/recovery', PasswordController.postRecovery);
passwordRoutes.get('/verifyToken', authenticateToken, PasswordController.getVerifyToken);
passwordRoutes.put('', authenticateToken, PasswordController.putChangePassword);
// passwordRoutes.post('/verifyCode', authenticateToken, PasswordController.postValidCode);
// passwordRoutes.get('/newCode', authenticateToken, PasswordController.getNewCode); 
//#endregion ################ Solicitar cambio de contraseña 

export default passwordRoutes;
  