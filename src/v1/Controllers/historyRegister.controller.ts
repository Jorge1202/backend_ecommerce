import { Request, Response } from 'express';
import { success, error } from '../../middlewares/response';

import { HistoryRegisterService } from '../Services/historyRegister.service';

class historyRegisterController extends HistoryRegisterService {

  constructor() {
    super(); 
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;

      // 2. Llamar al servicio para crear registro 
      const response = await this._createHistory(data);
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

      
    } catch (err: any) {
      error({ res, data: err.message, status: 409, details: err });
    }
  }

  public validEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Email, Id } = req.query;

      if(Id){
        const response = await this.valid_EmailwhithID(String(Email), Number(Id));
        const {code, message, isError} = response
        success({ res, data: message, status: code, isError});
        
      } else {
        const response = await this.valid_Email(String(Email));
        const {code, message, isError} = response
        
        success({ res, data: message, status: code, isError});
      }


      
    } catch (err: any) {
      error({ res, data: err.message, status: 409, details: err });
    }
  }

  public validUsername = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Username, Id } = req.query;

      if(Id){
        const response = await this.valid_UsernamewhithID(String(Username), Number(Id));
        const {code, message, isError} = response
        success({ res, data: message, status: code, isError});
        
      } else {
        const response = await this.valid_Username(String(Username));
        const {code, message, isError} = response
        success({ res, data: message, status: code, isError});
      }
      
      

      
    } catch (err: any) {
      error({ res, data: err.message, status: 409, details: err });
    }
  }

  
  public updataRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedRecord = await this.updateByRegister(req.body);
      if (updatedRecord) {
        const {code, message, isError} = updatedRecord
        success({ res, data: message, status: code, isError});
      } else {
        error({ res, data: 'Record not found', status: 204, });
      }
    } catch (err: any) {
      error({ res, data: err.message, status: 404, details: err });
    }
  }

}



export default new historyRegisterController();
