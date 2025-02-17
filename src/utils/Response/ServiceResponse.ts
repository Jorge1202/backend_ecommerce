export interface ServiceResponse<T> {
    error: boolean;
    body?: T | null;
    message: string;
    statusCode: number;
    tokens?: tokens | null
}

interface tokens {
    TOKEN_REFRESH?: string
    TOKEN_DEVICE?: string
}
  
interface SuccessResponseParams<T> {
    body?: T | null;
    message?: string;
    statusCode?: number;
    tokens?: tokens | null
}

interface ErrorResponseParams {
    message: string;
    statusCode?: number;
}

// Función para construir respuestas de éxito
export function successResponse<T>({
    body = null,
    message = 'Operación exitosa',
    statusCode = 200,
    tokens = null
    }: SuccessResponseParams<T>): ServiceResponse<T> {
    return {
        error: true,
        body,
        message,
        statusCode,
        tokens
    };
}

// Función para construir respuestas de error
export function errorResponse({
    message,
    statusCode = 500,
    }: ErrorResponseParams): ServiceResponse<any> {
    return {
        error: false,
        body: null,
        message,
        statusCode,
    };
}

