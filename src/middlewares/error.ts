class CustomError extends Error {
    statusCode?: number;
  
    constructor(message: string, code?: number) {
      super(message);
      if (code) {
        this.statusCode = code;
      }
    }
  }
  
  export function errorCatch(message: string, code?: number): CustomError {    
    return new CustomError(message, code);
  }
  