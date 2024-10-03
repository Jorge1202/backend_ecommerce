import { CodeAutentication, CodeAutenticationCreationAttributes } from '../models/code-autentication';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';
import error from '../../middlewares/error';

export class CodeAutenticationService {

  // Crear código de autenticación
  public async createCodeEmail(codeData: CodeAutenticationCreationAttributes, transaction?: Transaction): Promise<CodeAutentication> {
    try {

      await this._changeToInactive(codeData)    
      
      const codeAleatorio = await this._generarCodigoAleatorio();
      codeData = {...codeData, Code: codeAleatorio}
      const code = await CodeAutentication.create(codeData, { transaction });
      return code;

    } catch (err) {
      handleServiceError(err, 'Error creating authentication code', 500)
    }
  }

  private async _changeToInactive (codeData: CodeAutenticationCreationAttributes): Promise<any> {
     try {

      const [updatedCount, updatedUsers] = await CodeAutentication.update({IsActive: false}, {
        where: {
          IdAuth:codeData.IdAuth,
          IdTypeCode:codeData.IdTypeCode
        },
        returning: true
      });

      // if (updatedCount === 0) {
      //   throw error('No users found with the specified role');
      // }
      return updatedUsers
     } catch (err) {
      error(`${err}`, 500)
     } 
  }


  private async _generarCodigoAleatorio():Promise<string>{
    // Genera un número aleatorio entre 100000 y 999999
    const codigo = Math.floor(100000 + Math.random() * 900000);
    return codigo.toString()
  }

  public async validCodeEmail (code: string):Promise<any> {
    try {
      const fineCode = await this.findByCode(code) 
      if(!fineCode) {throw error('Codigo invalido', 409)}
  
      await fineCode.update({IsActive: false});

      return fineCode 
    } catch (err) {
      error(`${err}`, 400)
    }
  }

  public async findByCode(Code:string):Promise<CodeAutentication | null> {
    try {
      return await CodeAutentication.findOne({
        where:{Code}
      })
    } catch (err) {
      throw error(`${err}`)      
    }
  }


}
