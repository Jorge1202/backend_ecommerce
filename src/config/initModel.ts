import { Sequelize } from 'sequelize-typescript';
import { UserPage } from '../models/user-page';
import { TypePage } from '../models/type-page';
import { User } from '../models/user';

const initModel = (sequelize: Sequelize) => {

    User.initModel(sequelize)
    TypePage.initModel(sequelize)
    UserPage.initModel(sequelize)
}

export {initModel}