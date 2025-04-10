import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../Services/auth.service';
import { errorResponse, successResponse } from '../../Utils/Response/ControllerResponse';

import { generateCookieTokenRefresh, actionType } from '../../Secure/generateTokens';
import { verifyToken, extractToken } from '../../Secure/tokenJWT';
import { TokenRefresh } from '../../Secure/interfaceToken';


const UAParser = require('ua-parser-js');

class AuthController extends AuthService {

  constructor() {
    super(); 
  }

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
          
      const refreshToken = req.cookies?.[actionType.TOKEN_REFRESH];

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

      const {token:stringToken} = await extractToken(refreshToken)
      if(!stringToken){
        return errorResponse({
          res,
          message:'No existe token, se requiere cerrar sesion',
          status: 401  
        })  
      }

      /**Se optiene datos del usuario y se generan el Access token */
      const response = await this._newAccessToken(dataPayload, stringToken);    

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
    try {      
      const authHeader = req.headers['authorization'];

      if(!authHeader){
        return errorResponse({
          res,
          message:'Solicitud no autorizada',
          status: 401  
        })
      }

      const { payload, message, status, error  } = await verifyToken(authHeader)
      if(error || !payload){return errorResponse({ res, message, status })}

      successResponse({
        res,
        status,
        message,
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
