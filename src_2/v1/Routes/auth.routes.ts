import { Router } from 'express';
import { authenticateToken } from '../../Middlewares/authenticateToken '; 

import registerController from '../Controllers/register.controller';
import loginController from '../Controllers/login.controller';
import passwordController from '../Controllers/password.controller';
import authController from '../Controllers/auth.controller';

const auth = Router(); 

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints relacionados con la autenticación de usuarios
 */

//#region  ################ Generar cuenta  
/**
 * @swagger
 * /api/v1/auth/:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
auth.post('/', registerController.create); 
auth.get('/ViewVerifyEmail',authenticateToken, registerController.validViewVerifyEmail); 
auth.post('/validCodeByEmail', authenticateToken, registerController.validCodeByEmail); 
auth.get('/reSendCode',authenticateToken, registerController.reSendCode);  
//#endregion  ################ Generar codigo al crear cuenta 

//#region ################ Iniciar y cerrar sesión 
auth.post('/login', loginController.login);
auth.get('/verifyViewCodeDevice', authenticateToken, loginController.validViewNewDevice);
auth.post('/validCodeDevice', authenticateToken, loginController.validCodeDevice); 
auth.get('/newCodeDevice', authenticateToken, loginController.newCode_NewDevice); 
// auth.get('/logout/', authController.logout); 
//#endregion ################ Iniciar y cerrar sesión 

//#region ################ Solicitar cambio de contraseña 
auth.post('/validCodePassword', authenticateToken, passwordController.validCodePassword);
auth.put('/changePassword', authenticateToken, passwordController.changePassword); 
auth.get('/validarUser', authenticateToken, passwordController.validDataUser); 
auth.post('/recoverypassword', passwordController.recoveryPassword);
//#endregion ################ Solicitar cambio de contraseña

//#region ################ Token
auth.get('/autentication', authController.autenticationAccessToken);
auth.post('/newAccesToken', authController.newAccessToken);
//#endregion ################ Token

export default auth;