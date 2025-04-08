export class CustomError extends Error {
    public status: number;
  
    constructor(message: string, status: number = 500) {
      super(message);
      this.status = status;
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }
  