import { Router } from 'express';
import authController from '../Controllers/auth.controller';
import { authenticateToken } from '../../Middlewares/authenticateToken '; 

const userRoutes = Router(); 

//#region  ################ Generar cuenta  
userRoutes.get('/validCodeByEmail', authenticateToken, authController.validCodeByEmail); 
userRoutes.get('/ViewVerifyEmail',authenticateToken, authController.validViewVerifyEmail); 
userRoutes.get('/reSendCode',authenticateToken, authController.reSendCode);  
//#endregion  ################ Generar codigo al crear cuenta 

//#region ################ Iniciar y cerrar sesión 
userRoutes.post('/login', authController.login);
userRoutes.get('/verifyViewCodeDevice', authenticateToken, authController.validViewNewDevice);
userRoutes.post('/validCodeDevice', authenticateToken, authController.validCodeDevice); 
userRoutes.get('/newCodeDevice', authenticateToken, authController.newCode_NewDevice); 
// userRoutes.get('/logout/', authController.logout); 
//#endregion ################ Iniciar y cerrar sesión 

//#region ################ Solicitar cambio de contraseña 
userRoutes.post('/validCodePassword', authenticateToken, authController.validCodePassword);
userRoutes.put('/changePassword', authenticateToken, authController.changePassword); 
userRoutes.get('/validarUser', authenticateToken, authController.validDataUser); 
userRoutes.post('/recoverypassword', authController.recoveryPassword);
//#endregion ################ Solicitar cambio de contraseña

//#region ################ Token
userRoutes.get('/autentication', authController.autenticationAccessToken);
userRoutes.post('/newAccesToken', authController.newAccessToken);
//#endregion ################ Token

export default userRoutes;
  