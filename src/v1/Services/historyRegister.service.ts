import err from '../../middlewares/error';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import { HistoryRegister } from '../models/history-register';
import { Transaction } from 'sequelize';

export class HistoryRegisterService {
  
  // Crear historial de registro
  protected async _create(userData: HistoryRegister): Promise<HistoryRegister> {
    try {
      if(!userData.Email) {
        throw err('El correo ya se encuentra registrado', 409);
      }

      const existingRecord = await this._findByEmail(userData.Email);
      if (existingRecord) {
        throw err('El correo ya está registrado', 409);
      }

      return await HistoryRegister.create(userData);

    } catch (error) {
      handleServiceError(error, 'Error creando registro', 500);
    }
  }

  // Obtener historial de registro por Email
  public async _findByEmail(Email: string): Promise<HistoryRegister | null> {
    try {
      return await HistoryRegister.findOne({
        where: { Email } // Busca donde el campo 'Email' coincida
      });
    } catch (error) {
      throw new Error(`Error fetching user with email ${Email}: ${error}`);
    }
  }

  // Actualizar historial de registro (con o sin transacción)
  public async _update(Email: string, data: Partial<HistoryRegister>, transaction?: Transaction): Promise<HistoryRegister | null> {
    try {
      const register = await this._findByEmail(Email);

      if (!register) {
        throw new Error(`Register with Email ${Email} not found`);
      }

      data = { ...data, StatusRegister: 7 };

      if (transaction) {
        await register.update(data, { transaction });
      } else {
        await register.update(data);
      }

      return register;
    } catch (error) {
      throw new Error(`Error updating Register: ${error}`);
    }
  }
}
