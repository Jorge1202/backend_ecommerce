import { Router } from 'express';
import { authenticateToken, decodeTokenEvenIfExpired } from '../../../common/middlewares/auth.middleware';
import NewUserController from '../controllers/register.controller';

const registerRoutes = Router();


//#region  ################ Generar cuenta   

// registerRoutes.put('/history', NewUserController.createHistory);

registerRoutes.post('/validEmail',  NewUserController.validEmail);
registerRoutes.post('/validUsername', NewUserController.postValidUsername);
registerRoutes.post('/', NewUserController.newUser);
registerRoutes.get('/verifyToken', authenticateToken, NewUserController.verifyToken);
registerRoutes.post('/verifyCode', authenticateToken, NewUserController.verifyCodeEmail);
registerRoutes.get('/newCode', decodeTokenEvenIfExpired, NewUserController.sendCodeAgain);

export default registerRoutes;

//#endregion ################ Generar cuenta    