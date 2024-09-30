import { Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { success, error } from '../../middlewares/response';

const bcrypt = require("bcrypt");
class AuthController extends AuthService {

  constructor() {
    super(); 
  }

  public getLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.params;

      const findData = await this._FindByUsernam_Protectede(String(username));

      if (findData) {
        const isMatch = await bcrypt.compare(password, findData.Password);
        
        bcrypt.compare(password, findData.Password, (err: Error | undefined, result: boolean) => {
            if (err) {
              success({ req, res, data: '¡Contraseña incorrecta!', status: 204 });
            } else if (result) {
              success({ req, res, data: '¡Contraseña correcta!', status: 200 });
            } else {
                console.log('Contraseña incorrecta. El usuario no puede iniciar sesión.');
            }
        });

      } else {
        success({ req, res, data: 'Usuario incorrecto', status: 204 });            
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record ', status: 500, details: err });
    }
  }

  public recoveryPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;
      const {Email} = data
      const response = await this._RecoveryPassword_Protected(Email);
      success({ res, data: response, status: 200 });
    } catch(err) {
      error({ res, data: 'Se tuvo un problema en la solicitud, te sugerimos que te pongas en contacto con soporte', status: 500, details: err });
    }
  }

  public validDataUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        error({ req, res, data: 'Token invalido', status: 401 });
      } else {
        const response = await this._ValidDataUser_Protected(token)
        success({ req, res, data: response, status: 200 });  
      }
    } catch (err: any) {
      error({ req, res, data: err.message , status: 409, details: err });
    }
  }

  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        error({ req, res, data: 'Token invalido', status: 401 });
      } else {
        const {Password} = req.body        
        const response = await this._ChangePassword_Protected(Password, token)

        success({ req, res, data: response, status: 200 });  
      }
    } catch (err: any) {
      error({ req, res, data: err.message , status: 409, details: err });
    }
  }


}
// interface 

export default new AuthController();
