import { Sequelize } from 'sequelize-typescript';

import { User } from '../user';
import { Auth } from '../auth';
import { CodeAutentication } from '../code-autentication';
import { UserPage } from '../user-page';
import { TypePage } from '../type-page';
import { Profile } from '../profile';
import { StatisticsProfile } from '../statistics-profile';
import { HistoryRegister } from '../history-register';
import { PageStore } from '../page-store';
import { StatusAuth } from '../status-auth';
import { Login } from '../login';
import { Devices } from '../devices';

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
    StatusAuth.initModel(sequelize)
    Login.initModel(sequelize)
    Devices.initModel(sequelize)
    //#endregion ######################### Create User
    
    //#region ######################### Create Store
    PageStore.initModel(sequelize)
    //#endregion ######################### Create Store

}

export {initModel}