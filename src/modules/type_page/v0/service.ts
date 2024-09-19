import { TypePageModel } from './model';

class TypePageService {
    // Obtener todos los registros
    public async findAll(): Promise<TypePageModel[]> {
        try {
            const list = await TypePageModel.findAll();
            return list;
        } catch (error) {
            console.error('Error obteniendo la lista:', error);
            throw error;
        }
    }

    // Obtener un registro por ID
    public async findByPk(id: string): Promise<TypePageModel | null> {
        try {
            return await TypePageModel.findByPk(id);
        } catch (error) {
            console.error('Error obteniendo el registro por ID:', error);
            throw error;
        }
    }

    // Crear un nuevo registro
    public async createData(pageData: Omit<TypePageModel, 'id_type_page'>): Promise<TypePageModel> {
        try {
            const newPage = await TypePageModel.create(pageData);
            return newPage;
        } catch (error) {
            console.error('Error creando registro:', error);
            throw error;
        }
    }

    // Actualizar un registro
    public async updateById(id: string, pageData: Partial<Omit<TypePageModel, 'id_type_page'>>): Promise<TypePageModel | null> {
        try {
            const pageToUpdate = await TypePageModel.findByPk(id);
            if (pageToUpdate) {
                await pageToUpdate.update(pageData);
                return pageToUpdate;
            }
            return null;
        } catch (error) {
            console.error('Error actualizando registro:', error);
            throw error;
        }
    }

    // Eliminar un registro
    public async deleteById(id: string): Promise<boolean> {
        try {
            const pageToDelete = await TypePageModel.findByPk(id);
            if (pageToDelete) {
                await pageToDelete.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error eliminando registro:', error);
            throw error;
        }
    }
}

export default new TypePageService();
