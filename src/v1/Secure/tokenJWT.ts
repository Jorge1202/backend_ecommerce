import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../../Config';

// Llave secreta para firmar el JWT (colócala en tus variables de entorno)
const JWT_SECRET = config.JWT_SECRET;

// Interfaz para el payload del token, donde se puede extender según sea necesario.
export interface TokenPayload {
  IdUser: string;
  email?: string;
  role?: string;
  iat?: number; // Opcional: Tiempo de emisión (se incluye automáticamente en el token)
  exp?: number; // Opcional: Tiempo de expiración (se incluye automáticamente en el token)
}

interface Token {
    dataToken: TokenPayload
    expiresIn: string
}



/**
 * Ejemplos de valores que puedes pasar:
    '1h' (1 hora)
    '10m' (10 minutos)
    '7d' (7 días)
    '3600' (3600 segundos o 1 hora)
 */
/**
 * 
 * @param userId 
 * @param expiresIn 
 * @returns 
 */

// Función para generar un JWT
export const generateToken = ({dataToken, expiresIn = '30m'}: Token): string => {
  // Payload: Se puede agregar más información si es necesario

  const { IdUser } = dataToken

  const payload: TokenPayload = { IdUser };

  // Generar el token con el payload y la llave secreta
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  console.log(token);
  
  return token;

};

// Función para verificar y decodificar el JWT
export const verifyToken = (token: string): { valid: boolean, message: string, cade:number, payload?: TokenPayload } => {
  try {
    // Verificar el token con la llave secreta
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { cade:200, valid: true, message: 'Token válido', payload: decoded }; // Retorna el payload si la verificación es exitosa
  } catch (error) {
    if (error instanceof TokenExpiredError) {
        return { cade:409, valid: false, message: 'Token ha expirado' };
      } else if (error instanceof JsonWebTokenError) {
        return { cade:404, valid: false, message: 'Token inválido' };
      } else {
        return { cade:500, valid: false, message: 'Error desconocido en la verificación del token' };
      }      
  }
};
