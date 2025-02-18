import { NextFunction, Request, Response } from 'express';
import { successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';

import { HistoryRegisterService } from '../Services/historyRegister.service';

class historyRegisterController extends HistoryRegisterService {

  constructor() {
    super(); 
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let data = req.body;

      // 2. Llamar al servicio para crear registro 
      const response = await this._createHistory(data);
      const {status, message, body} = response
      successResponse({ res, body, message, status: status});

      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public validEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { Email, Id } = req.query;

      if(Id){
        const response = await this.valid_EmailwhithID(String(Email), Number(Id));
        const {status, message, body, error} = response 
        if(error){return errorResponse({ res, message, status })}

        

        successResponse({ res,body, message, status});
        
      } else {
        const response = await this.valid_Email(String(Email));
        const {status, message, body, error} = response 
        if(error){return errorResponse({ res, message, status })}
        
        successResponse({ res, body, message, status});
      }


      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public validUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { Username, Id } = req.query;

      if(Id){
        const response = await this.valid_UsernamewhithID(String(Username), Number(Id));
        const {status, message, body, error} = response 
        if(error){return errorResponse({ res, message, status })}

        successResponse({ res, body, message, status});
        
      } else {
        const response = await this.valid_Username(String(Username));
        const {status, message, body, error} = response 
        if(error){return errorResponse({ res, message, status })}

        successResponse({ res, body, message, status});
      }
      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  
  public updataRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedRecord = await this.updateByRegister(req.body);
      if (!updatedRecord) {
        errorResponse({ res, message: 'Record not found', status: 400, });
      } 
      
      const {status, message, body, error} = updatedRecord
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});      
      
    } catch (err:any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

}



export default new historyRegisterController();
