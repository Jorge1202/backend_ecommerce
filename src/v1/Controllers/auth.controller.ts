import { Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { success, error } from '../../middlewares/response';
import { Transaction } from 'sequelize';

import { Auth } from '../models/auth';
import CodeController from './codeAuth.controller';
import { User } from '../models/user';

const bcrypt = require("bcrypt");
class AuthController extends AuthService {

  constructor() {
    super(); 
  }

  public create = async (req: Request, res: Response, transaction: Transaction): Promise<any> => {
    try {
        // 
        const data = req.body;
        let { auth, user } = data;
        const newRecord = await this._createAuth(auth, transaction)

        await this._createAuthCode(newRecord, user, transaction)
        
    } catch (err) {
      throw new Error(`Error creating Auth record: ${err}`);
      // error({ req, res, data: 'Error creating record... ', status: 500, details: err });
    }
  }

  private async _createAuth(auth: Auth, transaction: Transaction): Promise<any> {
    const { Password } = auth;
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);
    
    // Crear el objeto con las propiedades necesarias
    const authData = {
      Password: hashedPassword,
      IdUser: auth.IdUser,
      DataCreate: new Date(),
      Username: auth.Username,
      Pw: Password, // Guardar la contraseña original en caso necesario
    };
  
    // Usar Sequelize para crear una instancia del modelo Auth en la base de datos
    const newRecord = await Auth.create(authData, { transaction });
  
    return newRecord;
  }



  private async _createAuthCode(auth: Auth, user: User, transaction: Transaction): Promise<void> {

    const body = { 
      code_autentication: { 
        IdAuth: auth.IdAuth,
        Description: 'Validar primer acceso',      
      },
      IdUser: auth.IdUser,
      user
    }

    await CodeController.create({body:body} as Request, {} as Response , transaction);
  }


  public getByUsername = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.params;

      const findData = await this._findByUsername(String(username));

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

}
// interface 

export default new AuthController();
