import {Response } from 'express';
import {MiddlewareResponse} from '../Utils/Response/ControllerResponse';

// Middleware para capturar todos los errores generados en el API
const errorsMiddleware = (err: any, res: Response) => {
  console.error('[error]', err);

  const message = err.message || 'Error interno';
  const status = err.statusCode || 500;

  MiddlewareResponse({res, message, status});
};

export {errorsMiddleware};



