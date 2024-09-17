import { Request, Response, NextFunction } from 'express';
import { statusMessage } from './codeRecuest';
import { error } from './response';  

export interface CustomError extends Error {
    statusCode: number;
}

function errors(err: CustomError, req: Request, res: Response, next: NextFunction): void {
    console.log('[error] ', err);

    const num_error = err.statusCode || 500
    const message = err.message || statusMessage[num_error];
    const status = num_error;

    error(req, res, message, status);    
}

export default errors;
