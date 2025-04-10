import { Transaction } from 'sequelize';
import { CodeAutentication, CodeAutenticationCreationAttributes } from '../models/code-autentication';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';

export class CodeAuthenticationService {
  public async createNewCode(
    codeData: CodeAutenticationCreationAttributes,
    transaction?: Transaction
  ): Promise<CodeAutentication> {
    try {
      // 1️⃣ Desactivar códigos anteriores
      await this._deactivatePreviousCodes(codeData, transaction);

      // 2️⃣ Generar código aleatorio
      const newCode = this._generateRandomCode();

      // 3️⃣ Crear nuevo código
      const code = await CodeAutentication.create(
        { ...codeData, Code: newCode },
        { transaction }
      );

      return code;

    } catch (error: any) {
      throw ErrorHandler.handleServiceError(error, 'createNewCode', 'CodeAuthenticationService' );
    }
  }

  private async _deactivatePreviousCodes(
    codeData: CodeAutenticationCreationAttributes,
    transaction?: Transaction
  ) {
    await CodeAutentication.update({IsActive: false}, {
      where: {
        IdAuth:codeData.IdAuth,
        IdTypeCode:codeData.IdTypeCode, 
        IsActive:true 
      },   
      transaction      
    });

  }

  private _generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
  }
}
