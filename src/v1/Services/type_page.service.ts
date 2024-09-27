import { TypePage } from '../models/type-page'; 

export class TypePageService {
  protected async _ProtectedFindAll(): Promise<TypePage[]> {
    try {      
      const list = await TypePage.findAll();
      return list;
    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _ProtectedFindByPk(id: number): Promise<TypePage | null> {
    try {
      const record = await TypePage.findByPk(id); // Remover el include de User
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }
  

  protected async _ProtectedCreate(data: TypePage): Promise<TypePage> {
    try {
      const newRecord = await TypePage.create(data);
      return newRecord;
    } catch (error) {
      throw new Error(`Error creating record: ${error}`);
    }
  }

  protected async _ProtectedUpdate(id: number, data: Partial<TypePage>): Promise<TypePage | null> {
    try {
      const record = await TypePage.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }
      await record.update(data);
      return record;
    } catch (error) {
      throw new Error(`Error updating record: ${error}`);
    }
  }

  protected async _ProtectedDestroy(id: number): Promise<number> {
    const result = await TypePage.destroy({
      where: { IdTypePage: id },
    });
    return result;
  }  
}
