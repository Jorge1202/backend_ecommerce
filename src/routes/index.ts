import express from 'express';

//#region ############################ VERION 1
import testRoutes from '../api/v1/routes/test.routes'
import register from '../api/v1/routes/register.routes'
import auth from '../api/v1/routes/auth.routes'
import password from '../api/v1/routes/password.route'
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

router.use(`/${v.v1}/pruebas`, testRoutes);
router.use(`/${v.v1}/register`, register);
router.use(`/${v.v1}/auth`, auth);
router.use(`/${v.v1}/password`, password);



export default router;
