// Tipos para los parámetros de las funciones
import { Request, Response, NextFunction } from 'express';
// Definición del mensaje de estado
import { statusMessage } from '../Utils/codeRecuest';



interface ResponseParams {
    req?: Request;
    res: Response;
    data?: any;
    status?: number;
    isError?: any;
    details?: any;
  }

/**
 * Respuestas exitosas
 */
export function success({
  req,
  res,
  data = 'Success',
  status = 200,
  isError = false,
}: ResponseParams): void {

  // Si data es un objeto y tiene una propiedad message, úsalo, si no, toma el valor de data como mensaje
  const message = typeof data === 'object' && data.message ? data.message : data;

  // Preparar la respuesta con status dinámico
  res.status(200).json({
      status,
      error: isError ? `Error: ${message}` : null,
      body: !isError ? data : null,
  });
}


/**
 * Respuestas con error
 */


export function error({
    req,
    res,
    data = 'Error', // Valor por defecto
    status = 500,   // Valor por defecto
    details
  }: ResponseParams): void {
    // details && console.error(`[response details] ${details}`)
    // data && console.error(`[response error] ${data}`)

    debugger
    const message = data || statusMessage[status] || 'Error';
    res.status(status).json({
      status,
      error: message,
      body: ''
    });
}
