import { Router } from 'express';
import userPageController from '../Controllers/user_page.controller';

const typePageRoutes = Router();

// typePageRoutes.get('/', userPageController.getAll);
// typePageRoutes.get('/:username', userPageController.getByUsername); // http://localhost:3000/api/v1/typePage/1
// typePageRoutes.get('/:id', userPageController.getById); // http://localhost:3000/api/v1/typePage/1
// typePageRoutes.put('/:id', userPageController.updateById);
// typePageRoutes.delete('/:id', userPageController.deleteById);

export default typePageRoutes;
  