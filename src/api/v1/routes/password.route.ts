import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const passwordRoutes = Router();

//#region ################ Solicitar cambio de contraseña 
passwordRoutes.post('/recovery', AuthController.loginByHash_Auth);
passwordRoutes.post('/verifyToken', AuthController.loginByHash_Auth);
passwordRoutes.post('/validCode', AuthController.loginByHash_Auth);
passwordRoutes.post('/change', AuthController.loginByHash_Auth);
passwordRoutes.post('/newCode', AuthController.loginByHash_Auth);
//#endregion ################ Solicitar cambio de contraseña 

export default passwordRoutes;
  