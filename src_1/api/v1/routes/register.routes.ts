import { Router } from 'express';
import NewUserController from '../controllers/register.controller';

const registerRoutes = Router();


//#region  ################ Generar cuenta  

registerRoutes.post('/history', NewUserController.createHistory);
// registerRoutes.put('/history', NewUserController.createHistory);

registerRoutes.post('/', NewUserController.newUser);
registerRoutes.post('/verifyToken', NewUserController.verifyToken);
registerRoutes.post('/verifyCode', NewUserController.verifyCodeEmail);

export default registerRoutes;

//#endregion ################ Generar cuenta