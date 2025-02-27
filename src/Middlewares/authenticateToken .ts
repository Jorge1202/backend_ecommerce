import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { MiddlewareResponse } from '../Utils/Response/ControllerResponse';
import { CustomRequest } from '../Utils/Response/ControllerResponse';
import { verifyToken } from '../Secure/tokenJWT';
import { TokenLogin } from '../Secure/interfaceToken';

dotenv.config();

/**
 * Middleware para autenticar solicitudes basadas en JWT
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 *    Flujos de Solicitud del Cliente
      Inicio de sesión:
      El servidor devuelve ambos tokens.
      El cliente usa el access token para llamadas a rutas protegidas.
 */
export const authenticateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Verificar que el token esté presente
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return MiddlewareResponse({
            res,
            message: 'Solicitud no autorizada',
            status: 401
        });
    }

    // Verificar el token
    const { payload, message, status, error } = await verifyToken(authHeader)
    if (error || !payload) { 
        return MiddlewareResponse({
            res,
            message,
            status
        });
    }
    const dataTokenAuthUser = payload as TokenLogin
    req.tokenData = dataTokenAuthUser;

    // Continuar con la siguiente middleware o controlador
    next();
};
