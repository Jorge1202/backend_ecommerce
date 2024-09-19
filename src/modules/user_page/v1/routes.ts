import { Router } from 'express';
import userPageController from './controller';

const typePageRoutes = Router();

typePageRoutes.get('/', userPageController.getAllUserPages);
typePageRoutes.get('/:id', userPageController.getUserPageById); // http://localhost:3000/api/v1/typePage/1
typePageRoutes.put('/:id', userPageController.updateUserPage);
typePageRoutes.delete('/:id', userPageController.deleteUserPage);
typePageRoutes.post('/', userPageController.createUserPage);

export default typePageRoutes;
  