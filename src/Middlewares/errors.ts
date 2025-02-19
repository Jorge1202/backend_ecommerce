import { Request, Response, NextFunction } from 'express';
import { MiddlewareResponse } from '../Utils/Response/ControllerResponse';

// Middleware para capturar todos los errores generados en el API
const errorsMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error('[error]', err); // Log del error para depuración

  const message = err.message || 'Error interno';
  const status = err.status || 500;

  MiddlewareResponse({ res, message, status });
};

export { errorsMiddleware };