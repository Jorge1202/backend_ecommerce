// Tipos para los parámetros de las funciones
import { Request, Response, NextFunction } from 'express';
// Definición del mensaje de estado
import { statusMessage } from '../utils/codeRecuest';



interface ResponseParams {
    req?: Request;
    res: Response;
    data?: any;
    status?: number;
    details?: any;
  }

/**
 * Respuestas exitosas
 */
export function success({
    req,
    res,
    data = 'Success', // Valor por defecto
    status = 200,   // Valor por defecto
    details
  }: ResponseParams): void {
    const message = data || statusMessage[status] || 'Success';

    res.status(200).json({
        status,
        error: '',
        body: message
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
    console.error(`[response error] ${details ? details : data}`)

    const message = data || statusMessage[status] || 'Error';
    res.status(status).json({
        error: message,
        status,
        body: ''
    });
}
