import { Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { success, error } from '../../middlewares/response';

const bcrypt = require("bcrypt");
class AuthController extends AuthService {

  constructor() {
    super(); 
  }

  public getByUsername = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.params;

      const findData = await this._ProtectedFindByUsername(String(username));

      if (findData) {
        const isMatch = await bcrypt.compare(password, findData?.Password);
        
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

  public recoveryPasswordValid = async (req: Request, res: Response): Promise<void> => {
    try {
      
    } catch (error) {
      
    }
  }
}
// interface 

export default new AuthController();
