import { TypePage, TypePageCreationAttributes } from '../../../models/type-page';

class TypePageService {
  // Obtener todos los TypePages
  async getAllTypePages(): Promise<TypePage[]> {
    return await TypePage.findAll();
  }

  // Obtener un TypePage por ID
  async getTypePageById(id: number): Promise<TypePage | null> {
    return await TypePage.findByPk(id);
  }

  // Crear un nuevo TypePage
  async createTypePage(data: Omit<TypePageCreationAttributes, 'IdTypePage'>): Promise<TypePage> {
    // Verificar que 'Description' esté presente
    if (!data.Description) {
      throw new Error('Description is required to create a TypePage');
    }
    
    return await TypePage.create(data);
  }

  // Actualizar un TypePage por ID
  async updateTypePage(id: number, data: Partial<TypePage>): Promise<[number, TypePage[]]> {
    return await TypePage.update(data, {
      where: { IdTypePage: id },
      returning: true,
    });
  }

  // Eliminar un TypePage por ID
  async deleteTypePage(id: number): Promise<number> {
    return await TypePage.destroy({
      where: { IdTypePage: id },
    });
  }
}

export const typePageService = new TypePageService();
