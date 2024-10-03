import { Request, Response, NextFunction } from 'express';
import {getTokenForDevice, getToken} from './auth.middleware'; 
import error from '../../middlewares/error';

type ActionType = 'token' | 'dispositivo' | 'get';

export function checkAuth(action: ActionType) {
  return async function middleware(req: Request, res: Response, next: NextFunction) {
    try {
      switch (action) {
        case 'token':
          const tokenResult = await getToken(req);
          if (tokenResult.error) {
            return next({
              message: tokenResult.message,
              statusCode: tokenResult.code || 500
            });
          }
          break;

        case 'dispositivo':
          const deviceResult = await getTokenForDevice(req);
          if (deviceResult.error) {
            return next({
              message: deviceResult.message,
              statusCode: deviceResult.code || 500
            });
          }
          break;

        case 'get':
          // No se requiere autenticación para este caso
          break;

        default:
          return next(error('Invalid action type'));
      }
      
      // Continúa al siguiente middleware o ruta
      next();

    } catch (err) {
      // Manejo de errores
      console.error(err);
      next({
        message: 'Internal server error',
        statusCode: 500
      });
    }
  }
}
