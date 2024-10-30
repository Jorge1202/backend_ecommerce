// errorHandler.ts
import { ValidationError, DatabaseError } from 'sequelize'; // Asegúrate de importar tus errores específicos

export class CustomError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function handleServiceError(error: any, customMessage: string, statusCode: number = 500): never {
  let errorMessage: string;

  if (error instanceof ValidationError) {
    errorMessage = `Error de validación en autenticación: ${error.errors.map(e => e.message).join(', ')}`;
  } else if (error instanceof DatabaseError) {
    errorMessage = 'Error en la base de datos al crear autenticación';
  } else {
    errorMessage = `${error.message}`;
  }

  // Lanza un error personalizado para el cliente
  throw new CustomError(`${customMessage}: ${errorMessage}`, statusCode);
}
