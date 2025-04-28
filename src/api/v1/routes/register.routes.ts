import { Router } from 'express';
import NewUserController from '../controllers/register.controller';

const registerRoutes = Router();


//#region  ################ Generar cuenta   

// registerRoutes.put('/history', NewUserController.createHistory);

registerRoutes.post('/verifyEmail', NewUserController.validEmail);
registerRoutes.post('/validUsername', NewUserController.postValidUsername);
registerRoutes.post('/', NewUserController.newUser);
registerRoutes.post('/verifyToken', NewUserController.verifyToken);
registerRoutes.post('/verifyCode', NewUserController.verifyCodeEmail);
registerRoutes.post('/newCode', NewUserController.sendCodeAgain);

export default registerRoutes;

//#endregion ################ Generar cuenta    