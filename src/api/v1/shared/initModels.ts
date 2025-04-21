import { Sequelize } from 'sequelize';

//#region ######################### VERSION 1
import { User } from '../models/user';
import { HistoryRegister } from '../models/history-register';
//#endregion ######################### VERSION 1

//#region ######################### VERSION 2
// import { User as UserV2 } from '../v1/models/user';
// import { HistoryRegister as HistoryRegisterV2 } from '../v1/models/historyRegister';
//#endregion ######################### VERSION 2



const initModel = (sequelize: Sequelize) => {
    // Inicialización de modelos de v1
    User.initModel(sequelize);
    HistoryRegister.initModel(sequelize);
    // ...
  
    // Inicialización de modelos de v2
    // UserV2.initModel(sequelize);
    // HistoryRegisterV2.initModel(sequelize);
    // ...
  };
  
  export { initModel };