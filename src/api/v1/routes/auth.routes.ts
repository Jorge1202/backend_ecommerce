import { Router } from 'express';
import { authenticateToken, decodeTokenEvenIfExpired } from '../../../common/middlewares/auth.middleware';
import AuthController from '../controllers/auth.controller';

const authRoutes = Router();


//#region  ################ Iniciar y cerrar sesión    
authRoutes.post('/loginHash', authenticateToken, AuthController.postLoginByHash);
authRoutes.post('/login', AuthController.postLogin);
authRoutes.post('/logout', decodeTokenEvenIfExpired, AuthController.postLogout);
authRoutes.post('/newAccesToken', AuthController.postNewAccesToken);
//#endregion  ################ Iniciar y cerrar sesión    

//#region ################ Nuevo Dispositivo
authRoutes.get('/verifyToken', authenticateToken, AuthController.getVerifyToken);
authRoutes.post('/verifyCode', authenticateToken, AuthController.postValidCodeDevice); 
authRoutes.get('/newCode', authenticateToken, AuthController.postNewAccesToken);
//#endregion ################ Nuevo Dispositivo

export default authRoutes;  