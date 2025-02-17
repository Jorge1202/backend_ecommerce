import { Response } from 'express';

export interface SuccessResponse<T> {
  res: Response;
  status?: number;
  message: string;
  body?: T | null;
}   

// Función para manejar respuestas exitosas
export const success = <T>({
  res,
  message = 'Operación exitosa',
  status = 200,
  body= null
}: SuccessResponse<T>): void => {
  // Log opcional para confirmar envíos exitosos (puedes omitirlo si no lo necesitas)
  console.log(`Éxito: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(status).json({
    error: false,
    status,
    message,
    body,
  });
};


// Función para manejar errores y enviar la respuesta de error
export const error = ({
  res,
  message = 'Internal server error', // Valor por defecto para el mensaje
  status = 500,
  body=null
}: {
  res: Response;
  message?: string;
  status?: number; // status es opcional, por defecto 500
  body?: null
}): void => {
  // Aseguramos consistencia en el log de errores
  console.error(`Error: ${message}, Status: ${status}`);

  // Enviamos la respuesta al cliente
  res.status(status).json({
    error: true,
    status,
    message,
    body
  });
};

