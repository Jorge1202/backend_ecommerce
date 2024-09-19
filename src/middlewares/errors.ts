import { Request, Response, NextFunction } from 'express';
import { statusMessage } from '../utils/codeRecuest';
import { error } from './response';  

export interface CustomError extends Error {
    statusCode: number;
}

function errors(err: CustomError, req: Request, res: Response, next: NextFunction): void {

    const num_error = err.statusCode || 500
    const message = err.message || statusMessage[num_error];
    const status = num_error;

    error({
        req, 
        res, 
        data: message, 
        status: status, 
        details: err
      });  
      next(); 
}

export default errors;
