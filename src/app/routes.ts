import { Express } from 'express';

//#region ############################ VERION 1
import historyRegister_1 from '../v1/Routes/historyRegister.routes'
import userRoutes_1 from '../v1/Routes/user.routes'
import userPageRoutes_v1 from '../v1/Routes/user_page.routes'
import typePageRoutes_v1 from '../v1/Routes/type_page.routes'
import authRoutes_v1 from '../v1/Routes/auth.routes'
import profileRoutes_v1 from '../v1/Routes/profile.routes'
//#endregion ############################ VERION 1


//El valor da referencia al nombre de la carpeta (v0, V1, ...vN)
const VERSION_NameFile = {
    v1:'v1',
    v2:'v2',
}
async function loadRoutes(app: Express) {
    try {

        //#region referencia v1
        app.use(`/api/${VERSION_NameFile.v1}/history-register`, historyRegister_1);
        app.use(`/api/${VERSION_NameFile.v1}/auth`, authRoutes_v1);
        app.use(`/api/${VERSION_NameFile.v1}/users`, userRoutes_1);
        
        app.use(`/api/${VERSION_NameFile.v1}/userpage`, userPageRoutes_v1);
        app.use(`/api/${VERSION_NameFile.v1}/typepage`, typePageRoutes_v1);
        app.use(`/api/${VERSION_NameFile.v1}/profile`, profileRoutes_v1);
        //#endregion referencia
        
    } catch (error) {
        console.error('Error loading routes:', error);
    }
}

export default loadRoutes;