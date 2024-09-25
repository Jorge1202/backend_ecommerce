import { Router } from 'express';
import codeController from '../Controllers/codeAuth.controller';

const codeRoutes = Router();

codeRoutes.get('/', codeController.getAll);
codeRoutes.get('/:id', codeController.getById); // http://localhost:3000/api/v1/code/1
// codeRoutes.put('/:id', codeController.updateById);
// codeRoutes.delete('/:id', codeController.deleteById);
// codeRoutes.post('/', codeController.create); //este metodo no se puede llamar por una solicitud HTTP

export default codeRoutes;
  