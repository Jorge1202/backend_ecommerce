import { CodeAutentication, CodeAutenticationCreationAttributes } from '../models/code-autentication';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/Response/handleServiceError';

export class CodeAutenticationService {

  //#region ######################################### Metodos Public
  // Crear código de autenticación
  public async createNewwCode(codeData: CodeAutenticationCreationAttributes, transaction?: Transaction): Promise<CodeAutentication> {
    try {

      await this._changeToInactive(codeData)    
      
      const codeAleatorio = this._generarCodigoAleatorio();
      codeData = {...codeData, Code: codeAleatorio}
      const code = await CodeAutentication.create(codeData, { transaction });
      return code;

    } catch (error:any) {
      handleServiceError(error, 'createNewwCode', error.statusCode)
    } 
  } 
  public async validCode (Code: string, IdAuth?:number):Promise<any> {
    try {

      const fineCode = await CodeAutentication.update({IsActive: false},{
        where:{
          Code,
          IsActive: true,
          IdAuth        
        }
      })

      return fineCode 
    } catch (error:any) {
      handleServiceError(error, 'validCode', error.statusCode)
    } 
  }
  public async findByCode(Code:string):Promise<CodeAutentication | null> {
    try {
      return await CodeAutentication.findOne({
        where:{Code}
      })
    } catch (error:any) {
      handleServiceError(error, 'findByCode', error.statusCode)
    } 
  }
  //#endregion ######################################### Metodos Public

  
  //#region ######################################### Metodos Private
  private async _changeToInactive (codeData: CodeAutenticationCreationAttributes): Promise<any> {
    try {

     const updatedUsers = await CodeAutentication.update({IsActive: false}, {
       where: {
         IdAuth:codeData.IdAuth,
         IdTypeCode:codeData.IdTypeCode, 
         IsActive:true 
       },              
       returning: true
     });

     // if (updatedCount === 0) {
     //   throw error('No users found with the specified role');
     // }
     return updatedUsers
   } catch (error:any) {
     handleServiceError(error, '_changeToInactive', error.statusCode)
   } 
 }

 private _generarCodigoAleatorio():string {
   // Genera un número aleatorio entre 100000 y 999999
   const codigo = Math.floor(100000 + Math.random() * 900000);
   return codigo.toString()
 }
  //#endregion ######################################### Metodos Private
  
  
  
  
  
  
 






}
