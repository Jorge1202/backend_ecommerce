import { Router } from 'express';
import authController from '../Controllers/auth.controller';
import { authenticateToken } from '../../Middlewares/authenticateToken '; 

const userRoutes = Router();


//#region  ################ Generar cuenta  
userRoutes.get('/validCodeByEmail', authController.validCodeByEmail); 
userRoutes.get('/ViewVerifyEmail', authController.validViewVerifyEmail); 
userRoutes.get('/reSendCode', authController.reSendCode);  
//#endregion  ################ Generar codigo al crear cuenta 

//#region ################ Iniciar y cerrar sesión 
userRoutes.post('/login', authController.login);
userRoutes.get('/verifyViewCodeDevice', authController.validViewNewDevice);
userRoutes.post('/validCodeDevice', authController.validCodeDevice); 
userRoutes.get('/newCodeDevice', authController.newCode_NewDevice); 
// userRoutes.get('/logout/', authController.logout); 
//#endregion ################ Iniciar y cerrar sesión 

//#region ################ Solicitar cambio de contraseña 
userRoutes.get('/validarUser', authController.validDataUser); 
userRoutes.post('/recoverypassword', authController.recoveryPassword);
userRoutes.post('/validCodePassword', authController.validCodePassword);
userRoutes.put('/changePassword', authController.changePassword); 
//#endregion ################ Solicitar cambio de contraseña

//#region ################ Token
userRoutes.post('/newAccesToken', authController.newAccessToken);
userRoutes.get('/autentication', authenticateToken, authController.autenticationAccessToken);
//#endregion ################ Token

export default userRoutes;
  