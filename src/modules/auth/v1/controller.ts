import { Request, Response } from 'express';
import AuthService from './service';

class AuthController {
  // Obtener todos los registros de autenticación
  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const auths = await AuthService.getAllAuths();
      return res.json(auths); // Responde con todos los registros
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener los registros de autenticación.', error });
    }
  }

  // Obtener un registro por ID
  public async findByPk(req: Request, res: Response): Promise<Response> {
    try {
      const { id_auth } = req.params;
      const auth = await AuthService.getAuthById(Number(id_auth));
      if (auth) {
        return res.json(auth); // Responde con el registro encontrado
      }
      return res.status(404).json({ message: 'Registro de autenticación no encontrado.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el registro de autenticación.', error });
    }
  }

  // Crear un nuevo registro de autenticación
  public async createData(req: Request, res: Response): Promise<Response> {
    try {
      const newAuth = await AuthService.createAuth(req.body); // Crea el registro con los datos del body
      return res.status(201).json(newAuth); // Responde con el registro creado
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el registro de autenticación.', error });
    }
  }

  // Actualizar un registro de autenticación por ID
  public async updateById(req: Request, res: Response): Promise<Response> {
    try {
      const { id_auth } = req.params;
      const [affectedCount, updatedAuths] = await AuthService.updateAuth(Number(id_auth), req.body);
      if (affectedCount > 0) {
        return res.json(updatedAuths[0]); // Responde con el registro actualizado
      }
      return res.status(404).json({ message: 'Registro de autenticación no encontrado.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar el registro de autenticación.', error });
    }
  }

  // Eliminar un registro de autenticación por ID
  public async deleteById(req: Request, res: Response): Promise<Response> {
    try {
      const { id_auth } = req.params;
      const deletedCount = await AuthService.deleteAuth(Number(id_auth));
      if (deletedCount > 0) {
        return res.status(204).send(); // No devuelve contenido si la eliminación fue exitosa
      }
      return res.status(404).json({ message: 'Registro de autenticación no encontrado.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el registro de autenticación.', error });
    }
  }
}

export default new AuthController();
