import {Response, NextFunction } from 'express';
import {error} from './response';

// Middleware para capturar todos los errores generados en el API
const errors = (err: any, res: Response, next: NextFunction) => {
  console.error('[error]', err);

  const message = err.message || 'Error interno';
  const status = err.statusCode || 500;

  error({res, message, status});
};

export {errors};



