import { Router } from 'express';
import ProfileController from '../Controllers/profile.controller';

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getAll);
profileRoutes.get('/:id', ProfileController.getById); // http://localhost:3000/api/v1/typePage/1
profileRoutes.put('/:id', ProfileController.updateById);
profileRoutes.delete('/:id', ProfileController.deleteById);
// profileRoutes.post('/', ProfileController.create);  //este metodo no se puede llamar por una solicitud HTTP

export default profileRoutes;
  