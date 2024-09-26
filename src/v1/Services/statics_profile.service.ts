import { StatisticsProfile, StatisticsProfileCreationAttributes } from "../models/statistics-profile";
import { Transaction } from 'sequelize';
import { handleServiceError } from '../../Utils/errorHandler_catch';

export class StatisticsProfileService {
    public async _createStatics(statics: StatisticsProfileCreationAttributes, transaction:Transaction):Promise<void>{
        try {
            await StatisticsProfile.create(statics, {transaction})
          } catch (error) {
            handleServiceError(error, 'Error creating statics profile', 500)
          }    
    }
}