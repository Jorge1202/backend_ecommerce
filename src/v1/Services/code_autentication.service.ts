import { CodeAutentication, CodeAutenticationCreationAttributes } from '../models/code-autentication';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';

export class CodeAutenticationService {

  // Crear código de autenticación
  public async _createCodeAuthentication(codeData: CodeAutenticationCreationAttributes, transaction: Transaction): Promise<void> {
    try {

      await CodeAutentication.create(codeData, { transaction });
    } catch (error) {
      handleServiceError(error, 'Error creating authentication code', 500)
    }
  }
  
}
