import { Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { success, error } from '../../middlewares/response';
import { DevicesCreationAttributes } from '../models/devices';
import _error from '../../middlewares/error';

import { ParamsLogin } from '../Services/auth.service';
const UAParser = require('ua-parser-js');

const bcrypt = require("bcrypt");
class AuthController extends AuthService {

  constructor() {
    super(); 
  }

  public getLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.params;

      const findData = await this._findByUsername(String(username));

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
      const response = await this._recoveryPassword(Email);
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
        const response = await this._validDataUser(token)
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
        const response = await this._changePassword(Password, token)

        success({ req, res, data: response, status: 200 });  
      }
    } catch (err: any) {
      error({ req, res, data: err.message , status: 409, details: err });
    }
  }


  public validCodeByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const {Code, Email} = req.body

      const response = await this._validCodeByEmail(Email, Code)
      success({ req, res, data: response, status: 200 });  

 
    } catch (err: any) {
      error({ req, res, data: err.message , status: 409, details: err });
    }
  }

  public generateCodeEmail = async (req: Request, res: Response):Promise<void> => {
    try {
      const { email } = req.params;

      const response = await this._generateCodeEmail(String(email));
      
      success({ res, data: response, status: 200 });

    } catch (err:any) {
      error({ req, res, data: err.message , status: 409, details: err });
    }
  }

  public login = async (req: Request, res: Response):Promise<void> => {
    const { Username, Password } = req.body;

    try {
      // Validar que username y password están presentes
      if (!Username || Username.trim() === "") {
        throw _error('El nombre de usuario es requerido',409 );
      }
    
      if (!Password || Password.trim() === "") {
        throw _error('La contraseña es requerida',409 );
      }

      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = req.headers['deviceToken'] as string | undefined;
      let deviceInfo: DevicesCreationAttributes | undefined;

      // Si no hay token, obtener la información del dispositivo
      if (!deviceToken) {
          deviceInfo = await this._getDataDevice(req);
      }

      // Llamar al servicio de login con los datos correspondientes
      const loginParams: ParamsLogin = {
        Login: {
          Username,
          Password
        },
        withToken: !!deviceToken,
        deviceToken,
        deviceInfo,
      };
      const response = await this._login(loginParams);

      success({ req, res, data: response, status: 200 }); 

    } catch (err:any) {
      error({ req, res, data: err.message , status: 409 });
    }

  }
  
  private _getDataDevice = async (req: Request): Promise<DevicesCreationAttributes> => {
    const userAgent = req.headers['user-agent'];
    
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();
    
    const _ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    return {
      UserAgent: userAgent,
      Plataform: result.os.name || 'Unknown',
      VersionPlataform : result.os.version  || 'Unknown',
      Browser: result.browser.name || 'Unknown',
      Mobile: result.device.type === 'mobile',
      Location: req.body.location || 'Unknown',
      Ip: String(_ip) || 'Unknown',
      Cpu : result.cpu.architecture  || 'Unknown',
    };
  }

}


// interface 

export default new AuthController();
