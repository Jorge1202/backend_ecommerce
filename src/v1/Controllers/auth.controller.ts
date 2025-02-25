import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
// import { success, error } from '../../middlewares/response';
import { errorResponse, successResponse } from '../../Utils/Response/ControllerResponse';
import { DevicesCreationAttributes } from '../models/devices';

import { generateCookieTokenRefresh, generateCookieTokenDevice } from '../../Secure/generateTokens';
import { ParamsLogin } from '../Services/auth.service';
import { verifyToken } from '../../Secure/tokenJWT';
import { TokenAuthUser, TokenLogin, TokenRefresh } from '../../Secure/interfaceToken';


const UAParser = require('ua-parser-js');

class AuthController extends AuthService {

  constructor() {
    super(); 
  }

  //#region  ################ Generar cuenta 
  public validCodeByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({res, message:'Token invalido', status:401});      
      }

      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser

      const {Code} = req.query

      // if (!Email || (typeof Email === 'string' && Email.trim() === "")) {
      //   return errorResponse({res, message:'El Email es requerido', status:409});  
      // }

  
      if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
        return errorResponse({res, message:'El código es requerido', status:400});  
      }


      const { body, message, status, error } = await this._validCodeByEmail(dataTokenAuthUser, String(Code))
      if(error){return errorResponse({ res, message, status })}

      
      // Inicializar la variable para saber si se utilizará un token
      const deviceToken = undefined;
      let deviceInfo: DevicesCreationAttributes | undefined;
      deviceInfo = await this._getDataDevice(req);

      const dataEmail = body
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
      if(response_loginAfter.error){ return errorResponse({res, message, status})}

      return successResponse({ res, 
        status: response_loginAfter.status,
        message: response_loginAfter.message, 
        body: response_loginAfter.body
      });

    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  public validViewVerifyEmail = async (req: Request, res: Response): Promise<void> => {
    const authHeader  = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return errorResponse({ res, message: 'Token invalido', status: 401 });      
    }

    const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
    if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
    const dataTokenAuthUser = payload as TokenAuthUser



    const { body, message, status, error }= await this._validViewVerifyEmail(dataTokenAuthUser)
    if(error){ return errorResponse({res, message, status})}

    return successResponse({ res, 
      message: message, 
      status: status,
      body: body
    });  

  }
  public reSendCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });      
      }

      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser

      const { email } = req.params;
      
      const { body, message, status, error } = await this._reSendCode(dataTokenAuthUser);
      if(error){return errorResponse({ res, message, status })}

      return successResponse({ res, 
        message: message, 
        status: status,
        body: body
      });

    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  //#endregion  ################ Generar cuenta 

  //#region ################ Iniciar sesión 
  public login = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    // const { Username, Password } = req.body;
    const { Username, Password } = req.body;
    
    const _Username = String(Username)
    const _Password = String(Password) 

    try {
      // Validar que username y password están presentes
      if (!_Username) {
        return errorResponse({res, message:'El nombre de usuario es requerido', status:400}); 
      }
    
      if (!_Password) {
        return errorResponse({res, message:'La contraseña es requerida', status:400}); 
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
      const { body, tokens, message, status, error } = await this._login(loginParams)
      if(error){return errorResponse({ res, message, status })}

      // Establecer la cookie HttpOnly con el token
      if(tokens){
        const {TOKEN_REFRESH, TOKEN_DEVICE} = tokens

        if(TOKEN_REFRESH){
          await generateCookieTokenRefresh(res, TOKEN_REFRESH)
        }

        if(TOKEN_DEVICE){
          await generateCookieTokenDevice(res, TOKEN_DEVICE)
        }
      }      

      return successResponse({ res,
        message,
        body, 
        status
      })

    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }

  }


  public validViewNewDevice = async (req: Request, res: Response, next:NextFunction):Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });      
      }


      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser


      const {body, message, status, error} = await this.fc_validViewNewDevice(dataTokenAuthUser)
      if(error){return errorResponse({ res, message, status })}

      return successResponse({ res, 
        message, 
        status,
        body: body        
      });
      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  } 
  public validCodeDevice = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      // Inicializar la variable para saber si se utilizará un token
      const authHeader  = req.headers['authorization'];
      const TokenValidDevice = authHeader && authHeader.split(' ')[1];
      if (!TokenValidDevice) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });      
      }

      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(TokenValidDevice)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser

      const { Code } = req.body;
      if(!Code){
        return errorResponse({ res, message: 'Código no exite', status: 400 }); 
      }

      let deviceInfo: DevicesCreationAttributes;
      deviceInfo = await this._getDataDevice(req);

      const {body, tokens, message, status, error} = await this.lg_validCodeDevice(Code, dataTokenAuthUser, deviceInfo)
      if(error){return errorResponse({ res, message, status })}

      if(tokens){
        const {TOKEN_REFRESH, TOKEN_DEVICE} = tokens

        
        if(TOKEN_REFRESH){
          generateCookieTokenRefresh(res, TOKEN_REFRESH)
        }

        if(TOKEN_DEVICE){
          generateCookieTokenDevice(res, TOKEN_DEVICE)
        }
      }

      return successResponse({ res, 
        body, 
        message, 
        status});

    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
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
  public newCode_NewDevice = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });      
      }


      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser


      const {body, message, status, error} = await this.fc_newCode_NewDevice(dataTokenAuthUser)    
      if(error){ return errorResponse({res, message, status})}  

      return successResponse({ res, 
        message: message, 
        status: status,
        body: body
      });
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
    
  }
  //#endregion ################ Iniciar sesión 

  //#region ################ CERRAR sesión 
  protected logout = async (req: Request, res: Response):Promise<void> => {
    /**
     * Cierre de sesión:
     * El cliente envía el refresh token para invalidarlo en el servidor.
     */
  }
  //#endregion ################ CERRAR sesión 

  //#region ################ Solicitar cambio de contraseña 
  public validDataUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });
      } 

      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser


      const {body, message, status, error} = await this._validDataUser(dataTokenAuthUser)
      if(error){ return errorResponse({res, message, status})} 

      return successResponse({ res, 
        body: body,
        message: message, 
        status: status
      }); 
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  public recoveryPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let info = req.body;
      const {Email} = info

      const {body, status, message, error} = await this._recoveryPassword(Email);
      if(error){ return errorResponse({res, message, status})}

      return successResponse({ res, message, status, body});
      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  public validCodePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });      
      }

      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser


      const {Code} = req.body        
      const {body, message, status, error} = await this._validCode(Code, dataTokenAuthUser)
      if(error){ return errorResponse({res, message, status})}

      return successResponse({ res, body, message, status});  
      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }


  }
  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader  = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return errorResponse({ res, message: 'Token invalido', status: 401 });
      } 

      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(token)
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataTokenAuthUser = payload as TokenAuthUser

      const {Password} = req.body        
      const {body, message, status, error} = await this._changePassword(Password, dataTokenAuthUser)
      if(error){ return errorResponse({res, message, status})}

      return successResponse({ res, body, message, status});  
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  //#endregion ################ Solicitar cambio de contraseña 

  //#region ################ TOKEN
  public newAccessToken  = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    // Solicitud un nuevo access token con el refresh token.
    // El servidor devuelve un nuevo access token (si el refresh token es válido).
    
    // El cliente detecta un error 401 o 403 al usar el access token.
    // Solicita un nuevo access token enviando el refresh token al servidor. TokensController
    // El servidor devuelve un nuevo access token (si el refresh token es válido).

    /**
     * Obtener el refreshToken desde las cookies
     * Verificar el token con la llave secreta
     * buscar en la base de datos para verificar si el token sigue siendo válido     
     * Si el token es válido, permite continuar
     * Generar un nuevo accessToken
     */

          // Obtener el refreshToken desde las cookies
      const refreshToken = req.cookies?._tkrsh ;

      if (!refreshToken) {
        return errorResponse({
          res,
          message:'No existe token, se requiere cerrar sesion',
          status: 401  
        })        
      }

    try {      
      const { payload, message: validMessage, status: validStatus, error: validError  } = await verifyToken(refreshToken, 'refresh')
      if(validError || !payload){return errorResponse({ res, message:validMessage, status:validStatus })}
      const dataPayload = payload as TokenRefresh

      /**Se optiene datos del usuario y se generan el Access token */
      const response = await this._newAccessToken(dataPayload, refreshToken);    

      if(response.error){
        return errorResponse({ res, message:response.message, status:response.status })
      }

      const {tokenLogin, tokenRefresh} = response.body

      if(tokenRefresh){        
        await generateCookieTokenRefresh(res, tokenRefresh)
      }

      successResponse({
        res,
        status:200,
        message:'Se a renovado su token de acceso',
        body: tokenLogin        
      })


    } catch(err: any) {
      // Manejar errores llamando al middleware de errores 
      next(err);
    }
  }

  public autenticationAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //servicioo para validar el token de los microservicios

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token 

    try {
      if(!token){
        return errorResponse({
          res,
          message:'No se proporcionó el token',
          status: 401  
        })
      }

      const { payload, message, status, error  } = await verifyToken(token)
      if(error || !payload){return errorResponse({ res, message, status })}
      const dataPayload = payload as TokenLogin

      successResponse({
        res,
        status,
        message,
        body: dataPayload
      })

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }

  }
  //#endregion ################ TOKEN




}


// interface 

export default new AuthController();
