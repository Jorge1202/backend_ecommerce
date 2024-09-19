import { Router } from 'express';
import userPageController from './controller';

const typePageRoutes = Router();

typePageRoutes.get('/', userPageController.getAll);
typePageRoutes.get('/:id', userPageController.getById); // http://localhost:3000/api/v1/typePage/1
typePageRoutes.put('/:id', userPageController.updateById);
typePageRoutes.delete('/:id', userPageController.deleteById);
typePageRoutes.post('/', userPageController.create);

export default typePageRoutes;
  