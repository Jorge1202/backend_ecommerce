import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();


//#region  ################ Generar cuenta 
userRoutes.get('/validCodeByEmail', authController.validCodeByEmail); 
userRoutes.get('/ViewVerifyEmail', authController.validViewVerifyEmail); 
userRoutes.get('/reSendCode', authController.reSendCode); 

// userRoutes.get('/generateCodeEmail/:email', authController.generateCodeEmail); 
//#endregion  ################ Generar codigo al crear cuenta 

//#region ################ Iniciar y cerrar sesión 
// userRoutes.get('/loginAfterRegister', authController.loginAfetr);

userRoutes.post('/login', authController.login);
userRoutes.get('/validCodeDevice/:code', authController.validCodeDevice); 
userRoutes.get('/logout/', authController.logout); 
//#endregion ################ Iniciar y cerrar sesión

//#region ################ Solicitar cambio de contraseña 
userRoutes.get('/validarUser', authController.validDataUser); 
userRoutes.post('/recoverypassword', authController.recoveryPassword);
userRoutes.post('/validCodePassword', authController.validCodePassword);
userRoutes.put('/changePassword', authController.changePassword); 
//#endregion ################ Solicitar cambio de contraseña


export default userRoutes;
  