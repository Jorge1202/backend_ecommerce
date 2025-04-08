import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../common/utils/response-controller/custom-error';
import {logger} from '../logger';

export const errorsMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    `❌ ${req.method} ${req.originalUrl} | Status: ${err.status || 500} | Message: ${err.message}`
  );

  res.status(err.status || 500).json({
    error: true,
    status: err.status || 500,
    message: err.message || 'Error interno del servidor',
  });
};
