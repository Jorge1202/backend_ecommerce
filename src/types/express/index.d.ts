import e, { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      dataToken?: any; // o un tipo específico como: dataToken?: { IdAuth: number }
    }
  }
}

export {};

