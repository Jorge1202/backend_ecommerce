import { Router } from 'express';
import authController from '../Controllers/auth.controller';
import loginController from '../Controllers/login.controller';
import registerController from '../Controllers/register.controller';
import passwordController from '../Controllers/password.controller';
import { authenticateToken } from '../../Middlewares/authenticateToken '; 

const userRoutes = Router(); 

//#region  ################ Generar cuenta  
userRoutes.get('/validCodeByEmail', authenticateToken, registerController.validCodeByEmail); 
userRoutes.get('/ViewVerifyEmail',authenticateToken, registerController.validViewVerifyEmail); 
userRoutes.get('/reSendCode',authenticateToken, registerController.reSendCode);  
//#endregion  ################ Generar codigo al crear cuenta 

//#region ################ Iniciar y cerrar sesión 
userRoutes.post('/login', loginController.login);
userRoutes.get('/verifyViewCodeDevice', authenticateToken, loginController.validViewNewDevice);
userRoutes.post('/validCodeDevice', authenticateToken, loginController.validCodeDevice); 
userRoutes.get('/newCodeDevice', authenticateToken, loginController.newCode_NewDevice); 
// userRoutes.get('/logout/', authController.logout); 
//#endregion ################ Iniciar y cerrar sesión 

//#region ################ Solicitar cambio de contraseña 
userRoutes.post('/validCodePassword', authenticateToken, passwordController.validCodePassword);
userRoutes.put('/changePassword', authenticateToken, passwordController.changePassword); 
userRoutes.get('/validarUser', authenticateToken, passwordController.validDataUser); 
userRoutes.post('/recoverypassword', passwordController.recoveryPassword);
//#endregion ################ Solicitar cambio de contraseña

//#region ################ Token
userRoutes.get('/autentication', authController.autenticationAccessToken);
userRoutes.post('/newAccesToken', authController.newAccessToken);
//#endregion ################ Token

export default userRoutes;