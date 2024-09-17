import { UserModel } from './model';

class UserService {
    // Obtener todos los registros
    public async findAll(): Promise<UserModel[]> {
        try {
            return await UserModel.findAll();
        } catch (error) {
            console.error('Error obteniendo todos los usuarios:', error);
            throw error;
        }
    }

    // Obtener un registro por ID
    public async findByPk(id: string): Promise<UserModel | null> {
        try {
            return await UserModel.findByPk(id);
        } catch (error) {
            console.error('Error obteniendo el usuario por ID:', error);
            throw error;
        }
    }

    // Crear un nuevo registro
    public async createData(userData: Omit<UserModel, 'id_user'>): Promise<UserModel> {
        try {
            return await UserModel.create(userData);
        } catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    }

    // Actualizar un registro
    public async updateById(id: string, dataInfo: Partial<Omit<UserModel, 'id_user'>>): Promise<UserModel | null> {
        try {
            const user = await UserModel.findByPk(id);
            if (user) {
                await user.update(dataInfo);
                return user;
            }
            return null;
        } catch (error) {
            console.error('Error actualizando el usuario:', error);
            throw error;
        }
    }

    // Eliminar un registro
    public async deleteById(id: string): Promise<boolean> {
        try {
            const user = await UserModel.findByPk(id);
            if (user) {
                await user.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error eliminando el usuario:', error);
            throw error;
        }
    }
}

export default new UserService();
