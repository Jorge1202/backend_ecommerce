import { Sequelize } from 'sequelize-typescript';


import { User } from '../../models/user';
import { Auth } from '../../models/auth';
import { UserPage } from '../../models/user-page';
import { TypePage } from '../../models/type-page';
import { Profile } from '../../models/profile';
import { StatisticsProfile } from '../../models/statistics-profile';

import { PageStore } from '../../models/page-store';

const initModel = (sequelize: Sequelize) => {
    
    TypePage.initModel(sequelize)

    //#region ######################### Create User
    User.initModel(sequelize)
    Auth.initModel(sequelize)
    UserPage.initModel(sequelize)
    Profile.initModel(sequelize)
    StatisticsProfile.initModel(sequelize)
    //#endregion ######################### Create User

    //#region ######################### Create Store
    PageStore.initModel(sequelize)
    //#endregion ######################### Create Store

}

export {initModel}