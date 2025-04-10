export interface ServiceResult<T> {
    error: boolean;
    body?: T | null;
    message: string;
    status: number;
    tokens?: tokens | null
}

interface tokens {
    TOKEN_REFRESH?: string
    TOKEN_DEVICE?: string
}
  
interface SuccessResultParams<T> {
    body?: T | null;
    message?: string;
    status?: number;
    tokens?: tokens | null
}

interface ErrorResultParams {
    message: string;
    status?: number;
}

// Función para construir respuestas de éxito
/**
 * 
 * @param param0 
 * @returns 
 * 205: 'Reset Content', // La solicitud fue exitosa y el cliente debe reiniciar la vista.  
 */
export function successResult<T>({
    body = null,
    message = 'Operación exitosa',
    status = 200,
    tokens = null
    }: SuccessResultParams<T>): ServiceResult<T> {
    return {
        error: false,
        body,
        message,
        status,
        tokens
    };
}

/**
 * Responde a un error controlado
 * @param param0 
 * @returns 
 * 400 Error de sintaxis o datos incompletos o inválidos
 * 401 El usuario no está autenticado o el token es inválido/expirado. 
 * 403 El usuario está autenticado, pero no tiene permisos para acceder al recurso
 * 404 Registro no encontrado pero es error esperado y manejable
 * 422 Reglas de negocio
 */
export function errorResult({
    message,
    status = 400,
    }: ErrorResultParams): ServiceResult<any> {
    return {
        error: true,
        body: null,
        message,
        status,
    };
}

/**
 * Responde con un error NO controlado throw catch
 * @param param
 * 409 Error crítico para el flujo.   
 * 500 Errores inesperados o no manejados.
 * 500 Falla en la base de datos.
 * 501 No cumple con la función necesaria para procesar la solicitud.
 * 502 Problemas de red
 * 503 El servidor no está disponible temporalmente
 */
export function throwServerError({
    message,
    status = 500,
    }: ErrorResultParams): ServiceResult<any> {
    throw {
        error: true,
        body: null,
        message,
        status,
    };
}
