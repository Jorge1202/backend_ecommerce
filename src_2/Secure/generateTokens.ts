import { Response } from 'express'
import { TokenRefresh, TokenLogin, Token_New_Device } from './interfaceToken'; //{ IdDeviceAuth: deviceAuth.IdDevice };
import { generateToken } from './tokenJWT';

type ActionType = {
  [key: string]: string;
};

export const actionType: ActionType = {
  TOKEN_REFRESH: "__Secure-RTK",
  DEVICE: "SSID",
};

// Función para generar el Refresh Token
export const generateTokenRefresh = (IdDeviceAuth: TokenRefresh): { message: string, token: string , code: number, expiresIn:number } => {

  if (!IdDeviceAuth) {
    return { message: 'Faltan datos para generar el token de Refresh', token: '', code: 409, expiresIn:0 };
  }

  const expiresIn= 30
  const token = generateToken({
    dataToken: IdDeviceAuth,
    expiresIn: `${expiresIn}d`,
    secretType:'refresh'
  })

  return { token, code: 200, message:'', expiresIn };
};

export const generateTokenAccess = (data: TokenLogin): { message: string, token: string, code: number, expiresIn:number } => {

  if (!data.IdAuth || !data.IdUserPage) {
    return { message: 'Faltan datos para generar el token de Access', token: '', code: 409, expiresIn:0 };
  }

  const expiresIn= 1
  const token = generateToken({
    dataToken: data,
    expiresIn: `${expiresIn}h`,
  })

  return { token, code: 200, message:'', expiresIn };

};

export const generateTokenValidCode = (IdAuth: Token_New_Device): { message: string, token: string, code: number, expiresIn:number } => {

  if (!IdAuth) {
    return { message: 'Faltan datos para generar el token', token: '', code: 409, expiresIn:0 };
  }

  const expiresIn= 30
  const token = generateToken({
    dataToken: IdAuth,
    expiresIn: `${expiresIn}m`,
  })

  return { token, code: 200, message:'', expiresIn };

};

/** Se usa del lado del controlador para enviar las cookes en formato http only
 * Cookie del tokenRefresh (_tkrsh)
 * @param res 
 * @param token 
 */
export const generateCookieTokenRefresh = async (res: Response, token:string): Promise<any> => {
  const refreshTokenTTL = 30 * 24 * 60 * 60 * 1000;  // 30 días en milisegundos  
    res.cookie(actionType.TOKEN_REFRESH, token, {
      httpOnly: true, // Protege contra ataques XSS
      maxAge: refreshTokenTTL, // 30 días en milisegundos
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
      sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) strict(produccion)
    });
};

/** Se usa del lado del controlador para enviar las cookes en formato http only
 * Cookie del token de dispositivo (_tkdv)
 * @param res 
 * @param token 
 */
export const generateCookieTokenDevice = async (res: Response, token:string): Promise<any> => {
  const fiveYearsInMilliseconds = 5 * 365 * 24 * 60 * 60 * 1000;
  res.cookie(actionType.DEVICE, token, {
    httpOnly: true, // Protege contra ataques XSS
    maxAge: fiveYearsInMilliseconds, // (5 años)
    secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
    sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) strict(produccion)
  });
};


