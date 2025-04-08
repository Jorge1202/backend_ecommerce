import { Request } from 'express';

export interface NewUser {
    Email: string;
    Password?: string;

    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    
    Genero?: string;
    Phone?: string;
} 

export interface TokenValidEmail {
    IdAuth?: number;
    IdUser?: string;
}


export interface CustomRequest extends Request {
    tokenData?: TokenValidEmail;  // Ahora req.tokenData tiene una estructura definida
}