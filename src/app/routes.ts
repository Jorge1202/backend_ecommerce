import { Express } from 'express';
//#region ############################ VERION 0
import userRoutes from '../modules/users/v0/routes'
//#endregion ############################ VERION 0

//#region ############################ VERION 1
import userRoutes_1 from '../modules/users/v1/routes'
import typePageRoutes_v1 from '../modules/type_page/v1/routes'
//#endregion ############################ VERION 1


const VERSION = {
    v:'v0',
    v1:'v1',
}
async function loadRoutes(app: Express) {
    try {

        //#region referencia v0        
        app.use(`/api/${VERSION.v}/users`, userRoutes);
        //#endregion referencia

        //#region referencia v1
        app.use(`/api/${VERSION.v1}/users`, userRoutes_1);
        app.use(`/api/${VERSION.v1}/typepage`, typePageRoutes_v1);
        //#endregion referencia

    } catch (error) {
        console.error('Error loading routes:', error);
    }
}


export default loadRoutes;