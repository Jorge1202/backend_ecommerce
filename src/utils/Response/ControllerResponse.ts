import { Response } from 'express';

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
  console.log(`Éxito: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(200).json({
    error: false,
    status,
    message,
    body,
  });
};


// Función para manejar errores y enviar la respuesta de error 
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
  console.error(`Invalid: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(200).json({
    error: true,
    status,
    message,
    body
  });
};


// Función para manejar errores inesperados del sistema se usa en el Middlewares y envia la respuesta 
export const MiddlewareResponse = ({
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
  // console.error(`Error: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(status).json({
    error: true,
    status,
    message,
    body
  });

};




