import { Request, Response, NextFunction } from 'express'
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../Config';
import { TokenPayload, Token } from './interfaceToken';

// Llave secreta para firmar el JWT (colócala en tus variables de entorno)
const JWT_SECRET = config.JWT_SECRET;

/**
 * Función para generar un JWT
 * @param dataToken Son datos que pertenecen a la interface TokenPayload
 * @param expiresIn Tiempo que expira el token
 * @returns Token JWT
 */
export const generateToken = ({dataToken, expiresIn='1d'}: Token): string => {
  /**
 * Ejemplos de valores que puedes pasar:
    '1h' (1 hora)
    '10m' (10 minutos)
    '7d' (7 días)
    '3600' (3600 segundos o 1 hora)
 */
  // Payload: Se puede agregar más información si es necesario

  const payload: TokenPayload = dataToken;

  // Generar el token con el payload y la llave secreta
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });  
  return token;

};


/**
 * Extrae y verifica el token desde el header de autorización.
 * @param req - Objeto de solicitud de Express.
 * @returns Un objeto con los datos decodificados o un error.
 */
export const getToken = async (req: Request): Promise<any> => {
  const authorization = req.headers.authorization || '';
  const decoded = await decodeHeader(authorization);

  if (decoded.error) {
    return decoded;
  } else {
    req.body.token = decoded.message;
    return decoded;
  }
};
/**
 * Función para verificar el token en dispositivos/navegadores.
 * @param req - Objeto de solicitud de Express.
 * @returns Un objeto con los datos decodificados o un error.
 */
export const getTokenForDevice = async (req: Request): Promise<any> => {
  const authorization = req.headers.authorization || '';
  
  if (authorization) {
    const decoded = await decodeHeader(authorization);

    if (decoded.error) {
      return decoded;
    }

    req.body.token = decoded.message;
    return decoded;
  }

  return {
    error: false,
    code: 400,
    message: 'Formato incorrecto'
  };
};

/**
 * Función para verificar y decodificar el JWT
 * @param token 
 * @returns 
 */
export const verifyToken = (token: string): { valid: boolean, message: string, code:number, payload?: TokenPayload } => {
  try {
    if (!token) {
      return {code:401, valid: false, message: 'No se proporcionó el token'};
    }

    // Verificar el token con la llave secreta
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { code:200, valid: true, message: 'Token válido', payload: decoded }; // Retorna el payload si la verificación es exitosa
  
  } catch (error) {
    if (error instanceof TokenExpiredError) {
        return { code:403, valid: false, message: 'Token ha expirado' };
      } else if (error instanceof JsonWebTokenError) {
        return { code:403, valid: false, message: 'Token inválido' };
      } else {
        return { code:403, valid: false, message: 'Error desconocido en la verificación del token' };
      }      
  }
};

/**
 * Decodifica y verifica el token JWT desde el header de autorización.
 * @param authorization - El header de autorización (Bearer Token).
 * @returns El token decodificado o un error.
 */
async function decodeHeader(authorization: string): Promise<any> {
  const token = extractToken(authorization);
  if (token.error) {
    return token;
  }

  const decoded = await verifyJWT(token.message);

  if (decoded.error) {
    return decoded;
  }

  return validateToken(decoded.message);
}

/**
 * Extrae el token del header de autorización.
 * @param authorization - El header de autorización.
 * @returns Un objeto que contiene el token o un error.
 */
function extractToken(authorization: string): any {
  if (!authorization) {
    return {
      error: true,
      code: 401,
      message: 'Se requiere un token para esta operación'
    };
  }

  if (!authorization.startsWith('Bearer ')) {
    return {
      error: true,
      code: 401,
      message: 'Formato de token incorrecto'
    };
  }

  const token = authorization.replace('Bearer ', '').trim();
  return { error: false, message: token };
}

/**
 * Verifica el token JWT utilizando la clave secreta.
 * @param token - El token JWT a verificar.
 * @returns Un objeto con el token decodificado o un error.
 */
async function verifyJWT(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { error: false, message: decoded };
  } catch (err) {
    return {
      error: true,
      code: 401,
      message: 'Token inválido'
    };
  }
}

/**
 * Valida el contenido del token decodificado.
 * @param token - El token JWT decodificado.
 * @returns Un objeto que indica si el token es válido o no.
 */
function validateToken(token: any): any {
  if (!token.id) {
    return {
      error: true,
      code: 401,
      message: 'Token incorrecto'
    };
  }
  
  return { error: false, message: token };
}


/**
 * Middleware para autenticar solicitudes basadas en JWT
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns 
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  const token = authHeader.split(' ')[1];
  const dataToken =  verifyToken(token)

  if(dataToken.code == 200){
    next()
    return
  } 
  res.status(dataToken.code).json({ valid: dataToken.valid, decoded:dataToken.message });
};