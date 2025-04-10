import { Response, Request } from 'express';
import { TokenLogin } from '../../Secure/interfaceToken';

// Definir una interfaz personalizada para extender Request
export interface CustomRequest extends Request {
  tokenData?: TokenLogin;  // Ahora req.tokenData tiene una estructura definida
}


export interface SuccessResponse<T> {
  res: Response;
  status: number;
  message: string;
  body?: T | null;
}   

// Función para manejar respuestas exitosas
export const successResponse = <T>({
  res,
  message = 'Operación exitosa',
  status = 200,
  body= null
}: SuccessResponse<T>): void => {
  if (res.headersSent) return;

  // Log opcional para confirmar envíos exitosos (puedes omitirlo si no lo necesitas)
  // console.log(`Éxito: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(200).json({
    error: false,
    status,
    message,
    body,
  });
};


/**
 * Responde a un error controlado
 * @param param0 
 * @returns 
 * 400 Error de sintaxis o datos incompletos o inválidos
 * 401 El usuario no está autenticado o el token es inválido/expirado. 
 * 403 El usuario está autenticado, pero no tiene permisos para acceder al recurso
 * 404 Registro no encontrado pero es error esperado y manejable
 * 422 Reglas de negocio
 */
export const errorResponse = ({
  res,
  message = 'Error de sintaxis o datos incompletos', // Valor por defecto para el mensaje
  status = 400,
  body=null
}: {
  res: Response;
  message: string;
  status: number; // status es opcional, por defecto 500
  body?: null
}): void => {
  if (res.headersSent) return;
  // Aseguramos consistencia en el log de errores
  // console.error(`Invalid: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(200).json({
    error: true,
    status,
    message,
    body
  });
};


// Función para manejar errores inesperados del sistema se usa en el Middlewares y envia la respuesta 
export const UnexpectedResponse = ({
  res,
  message = 'Internal server error', // Valor por defecto para el mensaje
  status = 500,
  body=null
}: {
  res: Response;
  message: string;
  status: number; // status es opcional, por defecto 500
  body?: null
}): void => {

  // Aseguramos consistencia en el log de errores
  console.error(`Error: [Status: ${status}] ${message}`);

  // Enviamos la respuesta al cliente
  res.status(status).json({
    error: true,
    status,
    message,
    body
  });

};




