import { Router } from 'express';
import { findAll, findByPk } from './controller';
// import { checkAuth } from '../../../utils/secure';

const userRoutes = Router();

// Definir las rutas para los usuarios
// router.get('/', getUser);
userRoutes.get('/', findAll);
userRoutes.get('/:id', findByPk);
// router.post('/', createUser);

export default userRoutes;

                      