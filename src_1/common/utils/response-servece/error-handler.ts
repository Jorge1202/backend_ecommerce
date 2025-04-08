import { CustomError } from '../response-controller/custom-error';
import { ValidationError, DatabaseError, UniqueConstraintError } from 'sequelize';
import { logger } from '../../../core/logger';

export class ErrorHandler {
  static handleServiceError(error: any, customMessage: string, clase: string): never {
    let errorMessage: string = error.message;
    let errorStatus: number = error.status || 500;

    if (error instanceof ValidationError) {
      errorMessage = `Validación fallida: ${error.errors.map(e => e.message).join(', ')}`;
      errorStatus = 422;
    } else if (error instanceof DatabaseError) {
      errorMessage = 'Error en la base de datos';
      errorStatus = 500;
    } else if (error instanceof UniqueConstraintError) {
      errorMessage = 'Error: Clave única violada';
      errorStatus = 409;
    }

    logger.error(`[${new Date().toISOString()}] ${clase} - ${customMessage}: ${errorMessage}`);

    throw new CustomError(errorMessage, errorStatus);
  }
}
