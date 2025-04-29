import { Router } from 'express';
import { authenticateToken } from '../../../common/middlewares/auth.middleware';
import AuthController from '../controllers/auth.controller';

const authRoutes = Router();


//#region  ################ Iniciar y cerrar sesión    
authRoutes.post('/loginHash', authenticateToken, AuthController.postLoginByHash);
authRoutes.post('/login', AuthController.postLogin);
authRoutes.post('/logout', AuthController.postLogout);
authRoutes.post('/verifyNewDevice', AuthController.postValidCodeDevice);
//#endregion  ################ Iniciar y cerrar sesión    

//#region ################ Login en nuevo Dispositivo
// authRoutes.post('/verifyToken', AuthController.postLogout);
// authRoutes.post('/verifyCode', AuthController.postLogout);
// authRoutes.post('/newCodeAgain', AuthController.postLogout);
//#endregion ################ Login en nuevo Dispositivo


export default authRoutes;
  