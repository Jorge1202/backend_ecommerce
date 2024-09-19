import {AuthModel} from './model';

class AuthService {
  // Obtener todos los registros de autenticación
  public async getAllAuths(): Promise<AuthModel[]> {
    return await AuthModel.findAll(); // Obtiene todos los registros
  }

  // Obtener un registro de autenticación por ID
  public async getAuthById(id_auth: number): Promise<AuthModel | null> {
    return await AuthModel.findOne({
      where: { id_auth },
    }); // Encuentra por la clave primaria
  }

  // Crear un nuevo registro de autenticación
  public async createAuth(data: Partial<AuthModel>): Promise<AuthModel> {
    return await AuthModel.create(data); // Crea un nuevo registro
  }

  // Actualizar un registro de autenticación por ID
  public async updateAuth(id_auth: number, data: Partial<AuthModel>): Promise<[number, AuthModel[]]> {
    return await AuthModel.update(data, {
      where: { id_auth },
      returning: true, // Devuelve el registro actualizado
    });
  }

  // Eliminar un registro de autenticación por ID
  public async deleteAuth(id_auth: number): Promise<number> {
    return await AuthModel.destroy({
      where: { id_auth },
    }); // Elimina el registro
  }
}

export default new AuthService();
