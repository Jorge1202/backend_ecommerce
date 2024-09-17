import { Router } from 'express';
import { findAll, findByPk, updateById, createData, deleteById } from './controller';

const userRoutes = Router();

// Definir las rutas
userRoutes.get('/', findAll);
userRoutes.get('/:id', findByPk); //http://localhost:3000/api/v1/users/1
userRoutes.put('/:id', updateById);
userRoutes.delete('/:id', deleteById);
userRoutes.post('/', createData);

export default userRoutes;
