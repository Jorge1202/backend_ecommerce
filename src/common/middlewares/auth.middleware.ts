import { Request, Response, NextFunction } from 'express';
import { verifyToken, verifyTokenExpired } from '../utils/authenticationToken';
import { ResponseHandler } from '../utils/response-controller/response-handler';
import { HttpStatus } from '../constants/httpStatus';

// Middleware para verificar el JWT
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {

    const token = req.headers['authorization'];  // Obtiene el token del encabezado
    if (!token) {
      return ResponseHandler.error(res, 401, 'Token required');  // Responde y termina la solicitud si no hay token
    }

    const resValid = await verifyToken(token)
    if(resValid.error || !resValid.payload){     
      if(resValid.status == 403){
        console.log('Caducado');        
      }

      return ResponseHandler.error(res, resValid.status, resValid.message); 
    }

    const {payload} =resValid
    req.body.Token = {
      payload,
      token: token.substring(7).trim()
    };  // Pasa la información decodificada al siguiente middleware
   
    next();  // Llama a `next()` para pasar al siguiente middleware
  } catch (err: any) {
    // Manejar errores llamando al middleware de errores
    next(err);
  }
}

export async function authorizationToken(req: Request, res: Response, next: NextFunction) {
  try {

    const token = req.headers['authorization'];  // Obtiene el token del encabezado
    if (!token) {
      return ResponseHandler.error(res, 401, 'Token required');  // Responde y termina la solicitud si no hay token
    }

    const resValid = await verifyToken(token)
    if(resValid.error || !resValid.payload){     
      if(resValid.status == 403){
        console.log('Caducado');        
      }

      return ResponseHandler.error(res, resValid.status, resValid.message); 
    }

    const {payload} =resValid
    req.body.Token = {
      payload,
      token: token.substring(7).trim()
    };  // Pasa la información decodificada al siguiente middleware
   
    next();  // Llama a `next()` para pasar al siguiente middleware
  } catch (err: any) {
    // Manejar errores llamando al middleware de errores
    next(err);
  }
}


export async function decodeTokenEvenIfExpired(req: Request, res: Response, next: NextFunction) {
  try {
    const getToken = req.headers['authorization'];  // Obtiene el token del encabezado
    if (!getToken) {
      return ResponseHandler.error(res, 401, 'Token required');  // Responde y termina la solicitud si no hay token
    }

    const resValid = await verifyToken(getToken)
    if(resValid.error || !resValid.payload){     
      if(resValid.status == HttpStatus.FORBIDDEN){   
        const token = getToken.substring(7).trim()          
        const {payload} = verifyTokenExpired(token)
        req.body.Token = { 
          payload, 
          token 
        };   

        next()
        return
      }

      return ResponseHandler.error(res, resValid.status, resValid.message); 
    }

    const {payload} =resValid
    req.body.Token = {
      payload,
      token: getToken.substring(7).trim()
    }; 
    
    next();  
  } catch (err: any) {
    // Manejar errores llamando al middleware de errores
    next(err);
  }
}