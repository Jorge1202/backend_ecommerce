import { CodeAutentication } from '../models/code-autentication';
import { Transaction } from 'sequelize';

export class CodeAutenticationService {
  protected async _findAll(): Promise<CodeAutentication[]> {
    try {      
      const list = await CodeAutentication.findAll();
      return list;
    } catch (error) {
      throw new Error(`Error obteniendo la lista: ${error}`);
    }
  }

  protected async _findByPk(id: number): Promise<CodeAutentication | null> {
    try {
      const record = await CodeAutentication.findByPk(id);
      return record;
    } catch (error) {
      throw new Error(`Error obteniendo el registro con id ${id}: ${error}`);
    }
  }

  protected async _create(data: CodeAutentication, transaction: Transaction): Promise<CodeAutentication> {
    try {
      const newRecord = await CodeAutentication.create(data, {transaction});
      return newRecord;
    } catch (error) {
      throw new Error(`Error creating record: ${error}`);
    } 
  }

  protected async _update(id: number, data: Partial<CodeAutentication>): Promise<CodeAutentication | null> {
    try {
      const record = await CodeAutentication.findByPk(id);
      if (!record) {
        throw new Error(`Record with id ${id} not found`);
      }

      await record.update(data);
      return record;
    } catch (error) {
      throw new Error(`Error actualizando registro con id ${id}: ${error}`);
    }
  }

  protected async _destroy(id: number): Promise<number> {
    const result = await CodeAutentication.destroy({
      where: { IdCodeAutentication: id },
    });
    return result;
  }
}
