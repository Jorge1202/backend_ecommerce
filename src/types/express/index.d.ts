import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      dataToken?: any;
    }
  }
}

export {};