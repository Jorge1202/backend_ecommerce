import { Sequelize } from 'sequelize-typescript';


import { User } from '../v1/models/user';
import { Auth } from '../v1/models/auth';
import { CodeAutentication } from '../v1/models/code-autentication';
import { UserPage } from '../v1/models/user-page';
import { TypePage } from '../v1/models/type-page';
import { Profile } from '../v1/models/profile';
import { StatisticsProfile } from '../v1/models/statistics-profile';
import { HistoryRegister } from '../v1/models/history-register';

import { PageStore } from '../v1/models/page-store';

const initModel = (sequelize: Sequelize) => {
    
    TypePage.initModel(sequelize)

    
    //#region ######################### Create User
    HistoryRegister.initModel(sequelize)
    User.initModel(sequelize)
    Auth.initModel(sequelize)
    CodeAutentication.initModel(sequelize)
    UserPage.initModel(sequelize)
    Profile.initModel(sequelize)
    StatisticsProfile.initModel(sequelize)
    //#endregion ######################### Create User
    
    //#region ######################### Create Store
    PageStore.initModel(sequelize)
    //#endregion ######################### Create Store

}

export {initModel}