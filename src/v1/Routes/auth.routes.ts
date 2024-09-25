import { Router } from 'express';
import authController from '../Controllers/auth.controller';

const userRoutes = Router();

userRoutes.get('/:username/:password', authController.getByUsername); 


export default userRoutes;
  