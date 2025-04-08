import { Response } from 'express';
import { ResponseFormat } from '../../interfaces/controller-response';

export class ResponseHandler {
  // Respuesta exitosa
  static success<T>(res: Response, status=200, message: string, body?: T): void {
    const response: ResponseFormat<T> = {
      error: false,
      status,
      message,
      body: body || null
    };
    res.status(status).json(response);
  }

  // Respuesta con error
  static error(res: Response, status: number, message: string): void {
    const response: ResponseFormat<null> = {
      error: true,
      status,
      message,
      body: null,
    };
    res.status(status).json(response);
  }
}
