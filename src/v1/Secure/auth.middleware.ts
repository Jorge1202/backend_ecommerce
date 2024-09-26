// archivo auth.middleware
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../Config';  // Archivo de configuración

const secret = config.jwt.secret;

/**
 * Función para firmar un token con los datos del usuario.
 * @param data - Información a ser codificada en el token.
 * @returns Un token JWT.
 */
function signToken(data: object): string {
  return jwt.sign(data, secret);
}

/**
 * Extrae y verifica el token desde el header de autorización.
 * @param req - Objeto de solicitud de Express.
 * @returns Un objeto con los datos decodificados o un error.
 */
const getToken = async (req: Request): Promise<any> => {
  const authorization = req.headers.authorization || '';
  const decoded = await decodeHeader(authorization);

  if (decoded.error) {
    return decoded;
  } else {
    // const login = await IdentityService.validateLogin(decoded.message.id, decoded.message.idDispositivo);

    // if (login.error) {
    //   return { error: true, code: 401, message: 'Sesión inválida. Por favor inicia sesión nuevamente.' };
    // }

    req.body.token = decoded.message;
    return decoded;
  }
};

/**
 * Función para verificar el token en dispositivos/navegadores.
 * @param req - Objeto de solicitud de Express.
 * @returns Un objeto con los datos decodificados o un error.
 */
const getTokenForDevice = async (req: Request): Promise<any> => {
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
 * Decodifica y verifica el token JWT desde el header de autorización.
 * @param authorization - El header de autorización (Bearer Token).
 * @returns El token decodificado o un error.
 */
async function decodeHeader(authorization: string): Promise<any> {
  const token = extractToken(authorization);
  if (token.error) {
    return token;
  }

  const decoded = await verifyToken(token.message);

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
async function verifyToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, secret);
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

export {
  signToken,
//   checkOwnership,
  getToken,
  getTokenForDevice
};
