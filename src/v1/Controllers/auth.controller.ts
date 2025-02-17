import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
// import { success, error } from '../../middlewares/response';
import { error, success } from '../../Utils/Response/response';
import { DevicesCreationAttributes } from '../models/devices';


import { ParamsLogin } from '../Services/auth.service';
const UAParser = require('ua-parser-js');

class AuthController extends AuthService {

  constructor() {
    super(); 
  }
  //#region Endpoint Token
  public newTokenRefresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token missing' });
    }

    // const response = await this._newTokenRefresh(refreshToken);
  }
  //#endregion Endpoint Token

  //#region  ################ Generar cuenta 
  public validCodeByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({res, message:'Token invalido', status:401});      
      }


      const {Code} = req.query

      // if (!Email || (typeof Email === 'string' && Email.trim() === "")) {
      //   throw error({res, message:'El Email es requerido', status:409});  
      // }
  
      if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
        throw error({res, message:'El código es requerido', status:400});  
      }

      const response = await this._validCodeByEmail(String(token), String(Code))
      if(response.statusCode !== 200){
        error({ res, message: response.message, status: response.statusCode});
        return
      }

      
      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = undefined;
      let deviceInfo: DevicesCreationAttributes | undefined;
      deviceInfo = await this._getDataDevice(req);

      const dataEmail = response.body
      const loginParams: ParamsLogin = {
        Login: {
          Username: String(dataEmail.Email),
          Code:String(dataEmail.Code)
        },
        withToken: !!deviceToken, 
        deviceToken,
        deviceInfo,
      };

      const response_loginAfter = await this.loginAfterRegister(loginParams);

      success({ res, 
        status: response_loginAfter.statusCode,
        message: response_loginAfter.message, 
        body: response_loginAfter.body
      });

    } catch (err: any) {
      // next()
      error({ res, message: err.message , status: err.status });
    }
  }
  public validViewVerifyEmail = async (req: Request, res: Response): Promise<void> => {
    const authHeader  = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw error({ res, message: 'Token invalido', status: 401 });      
    }

    const response = await this._validViewVerifyEmail(token)
    success({ res, 
      message: response.message, 
      status: response.statusCode,
      body: response.body
    });  

  }
  public reSendCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({ res, message: 'Token invalido', status: 401 });      
      }

      const { email } = req.params;

      const response = await this._reSendCode(token);
      success({ res, 
        message: response.message, 
        status: response.statusCode,
        body: response.body
      });

    } catch (err:any) {
      error({ res, message: err.message , status: err.status});
    }
  }
  //#endregion  ################ Generar cuenta 

  //#region ################ Iniciar sesión 
  public login = async (req: Request, res: Response):Promise<void> => {
    // const { Username, Password } = req.body;
    const { Username, Password } = req.body;
    
    const _Username = String(Username)
    const _Password = String(Password) 

    try {
      // Validar que username y password están presentes
      if (!_Username) {
        throw error({res, message:'El nombre de usuario es requerido', status:400}); 
      }
    
      if (!_Password) {
        throw error({res, message:'La contraseña es requerida', status:400}); 
      }

      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = req.cookies._tkdv;
      let deviceInfo: DevicesCreationAttributes | undefined;

      // Si no hay token, obtener la información del dispositivo
      if (!deviceToken) {
          deviceInfo = await this._getDataDevice(req);
      }

      // Llamar al servicio de login con los datos correspondientes
      const loginParams: ParamsLogin = {
        Login: {
          Username:_Username,
          Password:_Password
        },
        withToken: !!deviceToken,  //asigna true si existe token
        deviceToken,
        deviceInfo,
      };
      const {body, tokens, message, statusCode} = await this._login(loginParams);

      
      // Establecer la cookie HttpOnly con el token
      if(tokens){
        const {TOKEN_REFRESH, TOKEN_DEVICE} = tokens
  
        const refreshTokenTTL = 30 * 24 * 60 * 60 * 1000;  // 30 días en milisegundos
        if(TOKEN_REFRESH){
          res.cookie('_tkrsh', TOKEN_REFRESH, {
            httpOnly: true, // Protege contra ataques XSS
            maxAge: refreshTokenTTL, // 30 días en milisegundos
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
            sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) strict(produccion)
          });
        }

        const fiveYearsInMilliseconds = 5 * 365 * 24 * 60 * 60 * 1000;
        if(TOKEN_DEVICE){
          res.cookie('_tkdv', TOKEN_DEVICE, {
            httpOnly: true, // Protege contra ataques XSS
            maxAge: fiveYearsInMilliseconds, // (5 años)
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
            sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) strict(produccion)
          });
        }
      }      

      success({ res,
        message,
        body, 
        status: statusCode
      });

    } catch (err:any) {
      error({ res, message: err.message , status: err.statusCode  });
    }

  }
  public validViewNewDevice = async (req: Request, res: Response):Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({ res, message: 'Token invalido', status: 401 });      
      }

      const response = await this.fc_validViewNewDevice(token)
      success({ res, 
        message: response.message, 
        status: response.statusCode,
        body: response.body        
      });

    } catch (err:any) {
      error({ res, message: err.message , status: err.status });
    }
  } 
  public validCodeDevice = async (req: Request, res: Response):Promise<void> => {
    try {
      // Inicializar la variable para saber si se utilizará un token
      const authHeader  = req.headers['authorization'];
      const TokenValidDevice = authHeader && authHeader.split(' ')[1];
      if (!TokenValidDevice) {
        throw error({ res, message: 'Token invalido', status: 401 });      
      }

      const { Code } = req.body;
      if(!Code){
        throw error({ res, message: 'Código no exite', status: 400 }); 
      }

      let deviceInfo: DevicesCreationAttributes;
      deviceInfo = await this._getDataDevice(req);

      const {body, tokens, message, statusCode} = await this.lg_validCodeDevice(Code, TokenValidDevice, deviceInfo)

      if(tokens){
        const {TOKEN_REFRESH, TOKEN_DEVICE} = tokens
    
        const refreshTokenTTL = 30 * 24 * 60 * 60 * 1000;  // 30 días 
        if(TOKEN_REFRESH){
          res.cookie('_tkrsh', TOKEN_REFRESH, {
            httpOnly: true, // Protege contra ataques XSS
            maxAge: refreshTokenTTL, // 30 días
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
            sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) strict(produccion)
          });
        }

        const fiveYearsInMilliseconds = 5 * 365 * 24 * 60 * 60 * 1000; // (5 años)
        if(TOKEN_DEVICE){
          res.cookie('_tkdv', TOKEN_DEVICE, {
            httpOnly: true, // Protege contra ataques XSS
            maxAge: fiveYearsInMilliseconds, // (5 años)
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
            sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) strict(produccion)
          });
        }
      }

      success({ res, 
        body, 
        message, 
        status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.statusCode });
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
  public newCode_NewDevice = async (req: Request, res: Response):Promise<void> => {
    const authHeader  = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw error({ res, message: 'Token invalido', status: 401 });      
    }


    const response = await this.fc_newCode_NewDevice(token)
    success({ res, 
      message: response.message, 
      status: response.statusCode,
      body: response.body
    });
  }
  //#endregion ################ Iniciar sesión 

  //#region ################ CERRAR sesión 
  public logout = async (req: Request, res: Response):Promise<void> => {
  }
  //#endregion ################ CERRAR sesión 

  //#region ################ Solicitar cambio de contraseña 
  public validDataUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        error({ res, message: 'Token invalido', status: 401 });
      } else {
        const response = await this._validDataUser(token)
        success({ res, 
          body: response.body,
          message: response.message, 
          status: response.statusCode
        }); 
      }
    } catch (err: any) {
      error({ res, message: err.message , status: err.status });
    }
  }
  public recoveryPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      let info = req.body;
      const {Email} = info

      const {body, statusCode, message} = await this._recoveryPassword(Email);
      success({ res, message, status: statusCode, body});
      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }
  public validCodePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({ res, message: 'Token invalido', status: 401 });      
      }
  
      const {Code} = req.body        
      const {body, message, statusCode} = await this._validCode(Code, token)
      success({ res, body, message, status: statusCode});  
      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }


  }
  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        error({ res, message: 'Token invalido', status: 401 });
      } else {

        const {Password} = req.body        
        const {body, message, statusCode} = await this._changePassword(Password, token)
        success({ res, body, message, status: statusCode});  

      }
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }
  //#endregion ################ Solicitar cambio de contraseña 

}


// interface 

export default new AuthController();
