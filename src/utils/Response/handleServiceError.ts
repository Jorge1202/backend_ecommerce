// errorHandler.ts

// Importación de posibles errores que pueden ocurrir al interactuar con la base de datos
import { ValidationError, DatabaseError, UniqueConstraintError } from 'sequelize'; // Puedes añadir más según tus necesidades

// Clase personalizada de error para manejar errores con códigos de estado específicos
export class CustomError extends Error {
  public readonly statusCode: number;

  // Constructor que recibe un mensaje y un código de estado (por defecto 500)
  constructor(message: string, statusCode: number = 500) {
    super(message); // Llama al constructor de la clase base `Error`
    this.statusCode = statusCode; // Establece el código de estado
  }
}

/**
 * Maneja los errores de un servicio específico, proporcionando un mensaje personalizado
 * @param error - El error original capturado
 * @param customMessage - Mensaje personalizado para describir la operación fallida
 * @param statusCode - Código de estado HTTP a devolver en el error (por defecto 500)
 * @throws CustomError - Lanza un error personalizado basado en el tipo de error capturado
 */
export function handleServiceError(error: any, customMessage: string, statusCode: number = 500): never {
  let errorMessage: string;

  // Manejo específico para errores de validación
  if (error instanceof ValidationError) {
    errorMessage = `Error de validación en autenticación: ${error.errors.map(e => e.message).join(', ')}`;
  } 
  // Manejo específico para errores de base de datos
  else if (error instanceof DatabaseError) {
    errorMessage = 'Error en la base de datos al crear autenticación';  
  } 
  // Violación de clave única
  else if (error instanceof UniqueConstraintError) {
    errorMessage = 'Error: Violación de clave única';
  }
  // Si no se reconoce el error, se usa el mensaje original
  else {
    errorMessage = `${error.message}`;
  }

  // Loguea el error en la consola con el mensaje personalizado
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${customMessage}: ${errorMessage}`);
  
  // Lanza un error personalizado que será capturado por el middleware de manejo de errores en Express
  throw new CustomError(
    process.env.NODE_ENV === 'development'
      ? `${customMessage}: ${errorMessage}`
      : 'Ha ocurrido un error interno.',
    statusCode
  );
}
