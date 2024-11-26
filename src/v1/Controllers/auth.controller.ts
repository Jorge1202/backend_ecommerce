import { Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { success, error } from '../../middlewares/response';
import { DevicesCreationAttributes } from '../models/devices';
import { errorCatch } from '../../middlewares/error';


import { ParamsLogin } from '../Services/auth.service';
const UAParser = require('ua-parser-js');

class AuthController extends AuthService {

  constructor() {
    super(); 
  }
  //#region Endpoint Token
  // function generateTokens(user) {
  //   const accessToken = jwt.sign({ userId: user.id }, SECRET_ACCESS, { expiresIn: '15m' });
  //   const refreshToken = jwt.sign({ userId: user.id }, SECRET_REFRESH, { expiresIn: '7d' });
  
  //   return { accessToken, refreshToken };
  // }
  //#endregion Endpoint Token

  //#region  ################ Generar cuenta 
  public validCodeByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({ req, res, data: 'Token invalido', status: 401 });      
      }


      const {Code} = req.query

      // if (!Email || (typeof Email === 'string' && Email.trim() === "")) {
      //   throw errorCatch('El Email es requerido', 409);
      // }
  
      if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
        throw errorCatch('El código es requerido', 400);
      }

      const response = await this._validCodeByEmail(String(token), String(Code))

      const {message, isError} = response
      if(isError){
        const {code} = response
        success({ res, data: message, status: code, isError});
        return
      }

      
      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = undefined;
      let deviceInfo: DevicesCreationAttributes | undefined;
      deviceInfo = await this._getDataDevice(req);

      const loginParams: ParamsLogin = {
        Login: {
          Username: String(message.Email),
          Password:String(message.Code)
        },
        withToken: !!deviceToken, 
        deviceToken,
        deviceInfo,
      };

      const responseLogin = await this.loginAfterRegister(loginParams);
      const {code:codeLogin, message:messageLogin, isError:isErrorLogin} = responseLogin
      success({ res, data: messageLogin, status: codeLogin, isError: isErrorLogin});


 
    } catch (err: any) {
      error({ req, res, data: err.message , status: err.status, details: err });
    }
  }
  public validViewVerifyEmail = async (req: Request, res: Response): Promise<void> => {
    const authHeader  = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw error({ req, res, data: 'Token invalido', status: 401 });      
    }

    const response = await this._validViewVerifyEmail(token)
    const {code:codeResponse, message, isError} = response
    success({ res, data: message, status: codeResponse, isError});  

  }
  public reSendCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({ req, res, data: 'Token invalido', status: 401 });      
      }

      const { email } = req.params;

      const response = await this._reSendCode(token);
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch (err:any) {
      error({ req, res, data: err.message , status: err.status, details: err });
    }
  }

  // public validViewCode = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { email } = req.params;

  //     const response = await this._generateCodeEmail(String(email));
  //     const {code, message, isError} = response
  //     success({ res, data: message, status: code, isError});

  //   } catch (err:any) {
  //     error({ req, res, data: err.message , status: 409, details: err });
  //   }
  // }

  // public generateCodeEmail = async (req: Request, res: Response):Promise<void> => {
  //   try {
  //     const { email } = req.params;

  //     const response = await this._generateCodeEmail(String(email));
  //     const {code, message, isError} = response
  //     success({ res, data: message, status: code, isError});

  //   } catch (err:any) {
  //     error({ req, res, data: err.message , status: 409, details: err });
  //   }
  // }
  //#endregion  ################ Generar cuenta 

  //#region ################ Iniciar y cerrar sesión 
  public login = async (req: Request, res: Response):Promise<void> => {
    // const { Username, Password } = req.body;
    const { Username, Password } = req.body;
    
    const _Username = String(Username)
    const _Password = String(Password) 

    try {
      // Validar que username y password están presentes
      if (!_Username) {
        throw errorCatch('El nombre de usuario es requerido', 400);
      }
    
      if (!_Password) {
        throw errorCatch('La contraseña es requerida', 400);
      }

      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = req.headers['device-token'] as string | undefined;
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
      const response = await this._login(loginParams);

      const {tokenLogin, tokenDevice} = response

      // console.log(tokenLogin); 
      // console.log(tokenDevice);

      // const token = req.cookies.token;
      // // console.log(token);
      // Establecer la cookie HttpOnly con el token

      if(tokenLogin){
        res.cookie('token', tokenLogin, {
          httpOnly: true, // Protege contra ataques XSS
          secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
          maxAge: 3600000, // La duración de la cookie (1 hora en milisegundos)
          sameSite: 'strict', // Ayuda a prevenir ataques CSRF
        });
      }

      // const {code, message, isError} = response
      success({ res, data: response, status: 200, isError:false});

    } catch (err:any) {
      error({ req, res, data: err.message , status: err.status });
    }

  }

  public validCodeDevice = async (req: Request, res: Response):Promise<void> => {
    try {
      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = req.headers['device-token'] as string | undefined;
      const { code } = req.params;

      if(!code){
        throw errorCatch('Código no exite', 400);
      }

      if(!deviceToken){
        throw errorCatch('Falta la cabecera device-token', 400);
      }

      const response = await this._validCodeDevice(code, deviceToken)
      const {code:codeResponse, message, isError} = response
      success({ res, data: message, status: codeResponse, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public logout = async (req: Request, res: Response):Promise<void> => {

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
  //#endregion ################ Iniciar y cerrar sesión 

  //#region ################ Solicitar cambio de contraseña 
  public validDataUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        error({ req, res, data: 'Token invalido', status: 401 });
      } else {
        const response = await this._validDataUser(token)
        const {code:codeResponse, message, isError} = response
        success({ res, data: message, status: codeResponse, isError}); 
      }
    } catch (err: any) {
      error({ req, res, data: err.message , status: err.status, details: err });
    }
  }
  public recoveryPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;
      const {Email} = data
      const response = await this._recoveryPassword(Email);
      const {code:codeResponse, message, isError} = response
      success({ res, data: message, status: codeResponse, isError});
      
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }
  public validCodePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw error({ req, res, data: 'Token invalido', status: 401 });      
      }
  
      const {Code} = req.body        
      const response = await this._validCode(Code, token)
      const {code:codeResponse, message, isError} = response
      success({ res, data: message, status: codeResponse, isError});  
      
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
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
        const {code:codeResponse, message, isError} = response
        success({ res, data: message, status: codeResponse, isError});  

      }
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }
  //#endregion ################ Solicitar cambio de contraseña 

}


// interface 

export default new AuthController();
