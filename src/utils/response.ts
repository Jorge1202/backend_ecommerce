// Definición del mensaje de estado
import { statusMessage } from './codeRecuest';

// Tipos para los parámetros de las funciones
import { Request, Response } from 'express';

/**
 * Respuestas exitosas
 */
export function success(req: Request, resp: Response, data: any, status: number = 200): void {
    const message = statusMessage[status] || 'Success';
    resp.status(status).send({
        error: '',
        body: data || message
    });
}

/**
 * Respuestas con error
 */
export function error(req: Request, resp: Response, data: string, status: number = 500, details?: any): void {
    console.error(`[response error] ${details}`);
    const message = data || statusMessage[status] || 'Error';
    resp.status(status).send({
        error: message,
        body: ''
    });
}
