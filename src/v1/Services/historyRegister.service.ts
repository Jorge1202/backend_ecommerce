
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { HistoryRegister, HistoryRegisterCreationAttributes } from '../models/history-register';

export class HistoryRegisterService {

  // Crear historial de registro
  protected async _create(userData: HistoryRegister): Promise<HistoryRegister> {
    try {
      return await HistoryRegister.create(userData);
    } catch (error) {
      handleServiceError(error, 'Error creando registro', 500)
    }
  }


  // Obtener historial de registro por ID
  protected async _findByPk(id: number): Promise<HistoryRegister | null> {
    try {
      return await HistoryRegister.findByPk(id);
    } catch (error) {
      throw new Error(`Error fetching user with id ${id}: ${error}`);
    }
  }

  // Actualizar historial de registro
  protected async _update(id: number, data: Partial<HistoryRegister>): Promise<HistoryRegister | null> {
    try {
      const register = await HistoryRegister.findByPk(id);
      if (!register) {
        throw new Error(`Register with id ${id} not found`);
      }
      await register.update(data);
      return register;
    } catch (error) {
      throw new Error(`Error updating Register: ${error}`);
    }
  }
}
