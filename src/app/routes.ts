import { Express } from 'express';
//#region ############################ VERION 0
import userRoutes from '../modules/users/v0/routes'
//#endregion ############################ VERION 0

//#region ############################ VERION 1
import userRoutes_1 from '../modules/users/v1/routes'
import typePageRoutes_v1 from '../modules/type_page/v1/routes'
import userPageRoutes_v1 from '../modules/user_page/v1/routes'
//#endregion ############################ VERION 1


//El valor da referencia al nombre de la carpeta (v0, V1, ...vN)
const VERSION_NameFile = {
    v:'v0',
    v1:'v1',
    v2:'v2',
}
async function loadRoutes(app: Express) {
    try {

        //#region referencia v0        
        app.use(`/api/${VERSION_NameFile.v}/users`, userRoutes);
        //#endregion referencia

        //#region referencia v1
        app.use(`/api/${VERSION_NameFile.v1}/users`, userRoutes_1);
        app.use(`/api/${VERSION_NameFile.v1}/typepage`, typePageRoutes_v1);
        app.use(`/api/${VERSION_NameFile.v1}/userpage`, userPageRoutes_v1);
        //#endregion referencia
        
    } catch (error) {
        console.error('Error loading routes:', error);
    }
}


export default loadRoutes;