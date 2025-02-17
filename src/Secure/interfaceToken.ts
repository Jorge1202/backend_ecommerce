// Interfaz para el payload del token, donde se puede extender según sea necesario.
export interface TokenPayload {
    IdUser?: string;
    IdAuth?: number;
    IdDevice?: number;
    IdDeviceAuth?: number;
    IdUserPage?: number;
    email?: string;
    role?: string;
    iat?: number; // Opcional: Tiempo de emisión (se incluye automáticamente en el token)
    exp?: number; // Opcional: Tiempo de expiración (se incluye automáticamente en el token)
  }
  
  export interface Token {
      dataToken: TokenPayload
      expiresIn?: string
  }
  interface DataRefresh {
    IdRefreshToken: number
    ExpiresAt: Date
  }
  
  // Definimos las interfaces para los diferentes tipos de tokens
  export interface TokenLogin{
    IdAuth: number;
    IdUserPage: number;
    IdLogin: number;
    dataRefresh: DataRefresh
  }
  
  export interface TokenDevice{
    IdDevice: number;
  }
  export interface TokenRefresh{
    IdDeviceAuth: number; 
  }
  export interface Token_New_Device{
    IdAuth: number; 
  }
  
  // Ajustamos el tipo general del payload que puede ser un token de login o de dispositivo
  export type AllToken = TokenLogin | TokenDevice;