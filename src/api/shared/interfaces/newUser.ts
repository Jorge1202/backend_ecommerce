import { Request } from 'express';

export interface NewUser {
    IdHistoryRegister: number;
    Email: string;
    Password?: string;

    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    
    Genero?: string;
    Phone?: string;
} 
export interface CustomRequest extends Request {
    tokenData?: TokenValidEmail;  // Ahora req.tokenData tiene una estructura definida
}

export interface TokenValidEmail {
    IdAuth?: number;
    IdUser?: string;
}




export interface AuthPayload  {
    IdAuth: number;
    IdUser?: string;
}

export interface JwtOptions  {
  dataToken: AuthPayload
  expiresIn?: string
  secretType?: 'access' | 'refresh';
}