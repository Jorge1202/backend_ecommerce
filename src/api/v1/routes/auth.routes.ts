import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authRoutes = Router();


//#region  ################ Iniciar y cerrar sesión    
authRoutes.post('/loginHash', AuthController.loginByHash_Auth);
authRoutes.post('/login', AuthController.loginByHash_Auth);
authRoutes.post('/logout', AuthController.loginByHash_Auth);
//#endregion  ################ Iniciar y cerrar sesión    

//#region ################ Login en nuevo Dispositivo
authRoutes.post('/verifyToken', AuthController.loginByHash_Auth);
authRoutes.post('/verifyCode', AuthController.loginByHash_Auth);
authRoutes.post('/newCodeAgain', AuthController.loginByHash_Auth);
//#endregion ################ Login en nuevo Dispositivo


export default authRoutes;
  