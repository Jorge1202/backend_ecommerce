import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken, decodeTokenEvenIfExpired } from '../../../common/middlewares/auth.middleware';

const registerRoutes = Router();


//#region  ################ Metodos de prueba   
registerRoutes.get('/header', authenticateToken, UserController.getHeader);
registerRoutes.get('/address', authenticateToken, UserController.getAddress);

export default registerRoutes;