import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../../core/config';
import { TokenData, JwtOptions, ReturnToken } from '../interfaces/tokens';
import { HttpStatus } from '../constants/httpStatus';

// Llave secreta para firmar el JWT (colócala en tus variables de entorno)
const JWT_SECRET_ACCESS = config.JWT_SECRET;
const JWT_SECRET_REFRESH = config.JWT_SECRET_REFRESH;

type secretType = 'access' | 'refresh';

/**
 * Función para generar un JWT
 * @param dataToken Son datos que pertenecen a la interface TokenData
 * @param expiresIn Tiempo que expira el token
 * @returns Token JWT
 */
export const generateToken = (jwtToken: JwtOptions): ReturnToken => {
  /**
  * Ejemplos de valores que puedes pasar:
    '3600' (3600 segundos o 1 minuto)
    '10m' (10 minutos)
    '1h' (1 hora)
    '7d' (7 días)
 */
  const { dataToken, expiresIn = '1d', secretType = 'access' } = jwtToken


  // 🔥 Calcular timestamp de expiración (ahora + duración)
  const currentTimestamp = Math.floor(Date.now() / 1000); // segundos
  const expirationInSeconds = 60 * 60; // 1 hora
  const exp = currentTimestamp + expirationInSeconds;

  // Seleccionar la llave secreta según el tipo
  const secretKey = secretType === 'refresh' ? JWT_SECRET_REFRESH : JWT_SECRET_ACCESS;

  // Payload: Se puede agregar más información si es necesario
  const payload = dataToken;

  // Generar el token con el payload y la llave secreta
  const Token = jwt.sign(payload, secretKey, { expiresIn });

  const decoded = jwt.decode(Token) as { exp?: number };

  let ExpiresIn = new Date();
  if (decoded?.exp) {
    ExpiresIn = new Date(decoded.exp * 1000);
  }

  return {
    Token,
    ExpiresIn
  };
};

/**
 * Función para verificar y decodificar el JWT
 * @param token 
 * @returns 
 */
export const verifyToken = async (token: string, secretType: secretType = 'access'): Promise<{ error: boolean; message: string; status: number; payload?: TokenData }> => {
  try {
    if (!token) {
      return { status: HttpStatus.UNAUTHORIZED, error: true, message: 'No se proporcionó el token' };
    }

    // Verificar el token utilizando la función getToken (que ya decodifica el header y lo valida)
    const { error, status, message, payload } = await getToken(token, secretType);

    if (error || !payload) {
      return { status, error, message };
    }  
    return { status, error, message, payload };

  } catch (error: any) {
    console.error('Error desconocido en verifyToken:', error);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: true, message: `Error desconocido: ${error.message || 'Error en la verificación del token'}` };
  }
};


const getToken = async (token: string, secretType: string): Promise<{ error: boolean; message: string; status: number; payload: TokenData | null }> => {
  try {
    // Verificar el header y extraer el token
    const { error, status, message, payload } = await decodeHeader(token, secretType);

    if (error) {
      return {
        error,
        status,
        message,
        payload: null
      };
    }

    return {
      error,
      status,
      message,
      payload
    };

  } catch (error: any) {
    // console.error('Error en getToken:', error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno al procesar el token',
      payload: null
    };
  }
};

/**
 * Decodifica y verifica el token JWT desde el header de autorización.
 * @param authorization - El header de autorización (Bearer Token).
 * @returns El token decodificado o un error.
 */
async function decodeHeader(authorization: string, secretType: string): Promise<{ error: boolean; status: number; message: string; payload: TokenData | null }> {
  try {
    // 🔹 Extraer el token
    const token = extractToken(authorization);
    if (token.error || !token.token) {
      return {
        error: token.error,
        status: token.status,
        message: token.message,
        payload: null
      };
    }

    // 🔹 Verificar el JWT
    const decoded = await verifyJWT(token.token, secretType);
    if (decoded.error || !decoded.payload) {
      return {
        error: decoded.error,
        status: decoded.status,
        message: decoded.message,
        payload: null
      };
    }

    // 🔹 Validar y retornar el payload
    return {
      error: decoded.error,
      status: decoded.status,
      message: decoded.message,
      payload: decoded.payload,
    };

  } catch (error: any) {
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno al procesar el token',
      payload: null
    };
  }
}

/**
 * Extrae el token del header de autorización.
 * @param authorization - El header de autorización.
 * @returns Un objeto que contiene el token o un error.
 */
export function extractToken(authorization: string): { error: boolean; status: number; message: string; token?: string } {
  if (!authorization) {
    return {
      error: true,
      status: HttpStatus.UNAUTHORIZED,
      message: 'Se requiere un token para esta operación'
    };
  }

  if (!authorization.startsWith('Bearer ')) {
    return {
      error: true,
      status: HttpStatus.UNAUTHORIZED,
      message: 'Formato de token incorrecto'
    };
  }

  // Extraer y limpiar el token
  const token = authorization.substring(7).trim(); // 'Bearer ' tiene 7 caracteres

  return { error: false, message: '', status: 200, token }; // 🔹 Devuelve el token en su propio campo
}


/**
 * Verifica el token JWT utilizando la clave secreta.
 * @param token - El token JWT a verificar.
 * @returns Un objeto con el token decodificado o un error.
 */
async function verifyJWT(token: string, secretType: string): Promise<{ error: boolean; status: number; message: string; payload?: TokenData }> {
  try {

    // Seleccionar la llave secreta según el tipo
    const secretKey = secretType === 'refresh' ? JWT_SECRET_REFRESH : JWT_SECRET_ACCESS;

    const decoded = jwt.verify(token, secretKey) as TokenData;
    return { error: false, status: HttpStatus.OK, message: 'Token válido', payload: decoded };

  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      return { error: true, status: HttpStatus.FORBIDDEN, message: 'El token ha expirado. Por favor, renueva tu autenticación' };
    } else if (err instanceof JsonWebTokenError) {
      return { error: true, status: HttpStatus.UNAUTHORIZED, message: 'Token inválido' };
    } else {
      console.error('Error desconocido en verifyJWT:', err);
      return { error: true, status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error interno al verificar el token' };
    }
  }
}

export function verifyTokenExpired(token: string, secretType: string = 'access'){
  const secretKey = secretType === 'refresh' ? JWT_SECRET_REFRESH : JWT_SECRET_ACCESS;

  const decoded = jwt.verify(token, secretKey, { ignoreExpiration: true }) as TokenData;
  return { error: false, status: 200, message: 'Token válido', payload: decoded };
} 
