import express from 'express';

//#region ############################ VERION 1
import testRoutes from '../api/v1/routes/test.routes'
import registerRoutes from '../api/v1/routes/register.routes'
import authRoutes from '../api/v1/routes/auth.routes'
import passwordRoutes from '../api/v1/routes/password.route'
import userRoutes from '../api/v1/routes/user.routes'
//#endregion ############################ VERION 1

const router = express.Router();


//El valor da referencia al nombre de la carpeta (v0, V1, ...vN)
const v = {
    v1:'v1',
    v2:'v2',
}

router.use(`/${v.v1}/pruebas`, testRoutes);
router.use(`/${v.v1}/register`, registerRoutes);
router.use(`/${v.v1}/auth`, authRoutes);
router.use(`/${v.v1}/password`, passwordRoutes);
router.use(`/${v.v1}/user`, userRoutes);



export default router;
