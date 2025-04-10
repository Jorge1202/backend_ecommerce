export interface ServiceResponse<T> {
  body?: T | null; // Contiene la data de la respuesta si todo salió bien.
  error: boolean;  // Indica si hubo un error o no.
  message: string;  // Mensaje sobre la operación.
  status: number;   // Código HTTP de la respuesta (200, 400, 500, etc.).
}

export interface SuccessParams<T> {
  body?: T | null; // Datos de la respuesta.
  message: string; // Mensaje opcional.
  status: number; // Código HTTP (por defecto será 200).
  // tokens?: string | null; // Si hay tokens, se incluyen aquí.
}

export interface ErrorParams {
  message: string; // Mensaje de error.
  status?: number; // Código HTTP (por defecto será 400).
}

export interface CriticalErrorParams extends ErrorParams {
  error?: any; // Puede contener información extra del error.
}
