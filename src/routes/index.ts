import express from 'express';

//#region ############################ VERION 1
import methodPruebaRoutes from '../api/v1/routes/methodPrueba.routes'
import register from '../api/v1/routes/register.routes'
// import userRoutes_1 from '../v1/Routes/user.routes'
// import authRoutes_v1 from '../v1/Routes/auth.routes'
// // import profileRoutes_v1 from '../v1/Routes/profile.routes'
//#endregion ############################ VERION 1

const router = express.Router();


//El valor da referencia al nombre de la carpeta (v0, V1, ...vN)
const v = {
    v1:'v1',
    v2:'v2',
}


router.use(`/${v.v1}/pruebas`, methodPruebaRoutes);
router.use(`/${v.v1}/register`, register);



export default router;
