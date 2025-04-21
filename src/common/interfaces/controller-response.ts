import { Request } from 'express';
import {AuthPayload} from './auth'

export interface CustomRequest extends Request {
    dataToken?: AuthPayload;  // Ahora req.tokenData tiene una estructura definida
}

export interface ResponseFormat<T> {
    error: boolean;
    status: number;
    message: string;
    body?: T | null;
    tokens?: Record<string, string> | null;
}

