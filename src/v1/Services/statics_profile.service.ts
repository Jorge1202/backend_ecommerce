import { StatisticsProfile, StatisticsProfileCreationAttributes } from "../models/statistics-profile";
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';

export class StatisticsProfileService {
  //#region ######################################### Metodos Public
  public async createStatics(statics: StatisticsProfileCreationAttributes, transaction:Transaction):Promise<void>{
      try {
          await StatisticsProfile.create(statics, {transaction})
        } catch (error) {
          handleServiceError(error, 'Error creating statics profile', 400)
        }    
  }
  //#region ######################################### Metodos Public
}