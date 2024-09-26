import { CodeAutentication, CodeAutenticationCreationAttributes } from '../models/code-autentication';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';

export class CodeAutenticationService {

  // Crear código de autenticación
  public async _createCodeAuthentication(codeData: CodeAutenticationCreationAttributes, transaction: Transaction): Promise<CodeAutentication> {
    try {

      const codeAleatorio = await this.generarCodigoAleatorio();
      codeData = {...codeData, Code: codeAleatorio}
      const code = await CodeAutentication.create(codeData, { transaction });
      return code;

    } catch (error) {
      handleServiceError(error, 'Error creating authentication code', 500)
    }
  }
  private async generarCodigoAleatorio():Promise<string>{
    // Genera un número aleatorio entre 100000 y 999999
    const codigo = Math.floor(100000 + Math.random() * 900000);
    return codigo.toString()
  }

  
}
