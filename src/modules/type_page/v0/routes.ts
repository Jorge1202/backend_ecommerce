import { Router } from 'express';
import { findAll, findByPk, updateById, createData, deleteById } from './controller';

const typePageRoutes = Router();

typePageRoutes.get('/', findAll);
typePageRoutes.get('/:id', findByPk); // http://localhost:3000/api/v1/typePage/1
typePageRoutes.put('/:id', updateById);
typePageRoutes.delete('/:id', deleteById);
typePageRoutes.post('/', createData);

export default typePageRoutes;
