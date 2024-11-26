import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../../Config';

// Llave secreta para firmar el JWT (colócala en tus variables de entorno)
const JWT_SECRET = config.JWT_SECRET;

// Interfaz para el payload del token, donde se puede extender según sea necesario.
export interface TokenPayload {
  IdUser?: string;
  IdAuth?: number;
  IdDevice?: number;
  IdUserPage?: number;
  email?: string;
  role?: string;
  iat?: number; // Opcional: Tiempo de emisión (se incluye automáticamente en el token)
  exp?: number; // Opcional: Tiempo de expiración (se incluye automáticamente en el token)
}

interface Token {
    dataToken: TokenPayload
    expiresIn?: string
}

// Definimos las interfaces para los diferentes tipos de tokens
export interface TokenLogin{
  IdAuth: number;
  IdUserPage: number;
  IdLogin: number;
}

export interface TokenDevice{
  IdDevice: number;
  IdAuth: number;
  IdUser: string;
}

// Ajustamos el tipo general del payload que puede ser un token de login o de dispositivo
export type AllToken = TokenLogin | TokenDevice;

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
export const generateToken = ({dataToken, expiresIn='1d'}: Token): string => {
  // Payload: Se puede agregar más información si es necesario

  // const { IdUser } = dataToken

  const payload: TokenPayload = dataToken;

  // Generar el token con el payload y la llave secreta
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });  
  return token;

};

// Función para verificar y decodificar el JWT
export const verifyToken = (token: string): { valid: boolean, message: string, cade:number, payload?: TokenPayload } => {
  try {
    if (!token) {
      return {cade:401, valid: false, message: 'No se proporcionó un refresh token'};
    }

    // Verificar el token con la llave secreta
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { cade:200, valid: true, message: 'Token válido', payload: decoded }; // Retorna el payload si la verificación es exitosa
  } catch (error) {
    if (error instanceof TokenExpiredError) {
        return { cade:403, valid: false, message: 'Token ha expirado' };
      } else if (error instanceof JsonWebTokenError) {
        return { cade:403, valid: false, message: 'Token inválido' };
      } else {
        return { cade:403, valid: false, message: 'Error desconocido en la verificación del token' };
      }      
  }
};
