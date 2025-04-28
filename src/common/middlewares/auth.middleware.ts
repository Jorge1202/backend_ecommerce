import { Request, Response, NextFunction } from 'express';
import TokenService from '../../core/services/tokens/tokens_2.service';

// Middleware para verificar el JWT
export function checkToken(req: Request, res: Response, next: NextFunction): void | Response {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtiene el token del encabezado

  if (!token) {
    return res.status(401).send('Token required');  // Responde y termina la solicitud si no hay token
  }

  try {
    const decoded = TokenService.verifyAccessToken(token);
    req.dataToken = decoded;  // Pasa la información decodificada al siguiente middleware
    next();  // Llama a `next()` para pasar al siguiente middleware
  } catch (err) {
    return res.status(401).send('Invalid or expired token');  // Responde y termina si el token es inválido
  }
}
