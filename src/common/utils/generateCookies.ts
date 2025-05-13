import { Response } from 'express'

type ActionType = {
    [key: string]: string;
};

export const actionType: ActionType = {
    TOKEN_REFRESH: "Secure-RTK",
    DEVICE: "SSID",
};

/** Se usa del lado del controlador para enviar las cookes en formato http only
 * Cookie del tokenRefresh (_tkrsh)
 * @param res 
 * @param token 
 */
export const generateCookieTokenRefresh = async (res: Response, token:string): Promise<any> => {
    const refreshTokenTTL = 30 * 24 * 60 * 60 * 1000;  //30 días en milisegundos  

    res.cookie(actionType.TOKEN_REFRESH, token, {
        httpOnly: true, // Protege contra ataques XSS
        maxAge: refreshTokenTTL, //30 días en milisegundos
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si estás en producción
        //sameSite para permitir cookies entre // lax(local) | none(entre subdominios) | strict(en mismo domino)
        sameSite: process.env.NODE_ENV === 'production' ? 'strict':'lax', // lax(local) | none(entre subdominios) | strict(en mismo domino)
        // domain: '.tusitio.com', // compartir cookie entre tusitio.com y api.tusitio.com
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
  