import { UserPage, UserPageCreationAttributes } from '../models/user-page';
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResult, successResult, errorResult } from '../../Utils/Response/ServiceResult';


export class UserPageService {

  // //#region ######################################### Metodos Publicos
  public async createUserPage(userPageData: UserPageCreationAttributes, transaction: Transaction): Promise<ServiceResult<UserPage>> {
    try {
      const newRecord = await UserPage.create(userPageData, { transaction });
      if (!newRecord) {
        return errorResult({
          message: 'No se encuentra el registro',
          status: 404,
        });
      }

      return successResult({
        status: 400,
        message: 'Registro creado',
        body: newRecord
      });

    } catch (err: any) {
      handleServiceError(err, 'createUserPage', 'UserPageService');
    } 
  }
  // //#endregion ######################################### Metodos Publicos

}
