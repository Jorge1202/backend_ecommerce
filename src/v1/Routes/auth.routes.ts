import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();


//#region  ################ Generar cuenta 
userRoutes.get('/generateCodeEmail/:email', authController.generateCodeEmail); 
userRoutes.post('/validCodeByEmail', authController.validCodeByEmail); 
//#endregion  ################ Generar codigo al crear cuenta 

//#region ################ Iniciar y cerrar sesión 
// userRoutes.post('/login', authController.login);
userRoutes.get('/login/:Username/:Password', authController.login);
userRoutes.get('/validCodeDevice/:code', authController.validCodeDevice); 
userRoutes.get('/logout/', authController.logout); 
//#endregion ################ Iniciar y cerrar sesión

//#region ################ Solicitar cambio de contraseña 
userRoutes.post('/recoverypassword', authController.recoveryPassword);
userRoutes.put('/changePassword', authController.changePassword); 
userRoutes.get('/validarUser', authController.validDataUser); 
//#endregion ################ Solicitar cambio de contraseña


export default userRoutes;
  