import { Request, Response } from 'express';
import { success, error } from '../../Utils/Response/response';

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
      const {statusCode, message, body} = response
      success({ res, body, message, status: statusCode});

      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public validEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Email, Id } = req.query;

      if(Id){
        const response = await this.valid_EmailwhithID(String(Email), Number(Id));
        const {statusCode, message, body} = response
        success({ res,body, message, status: statusCode});
        
      } else {
        const response = await this.valid_Email(String(Email));
        const {statusCode, message, body} = response
        
        success({ res, body, message, status: statusCode});
      }


      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public validUsername = async (req: Request, res: Response): Promise<void> => {
    try {
      const { Username, Id } = req.query;

      if(Id){
        const response = await this.valid_UsernamewhithID(String(Username), Number(Id));
        const {statusCode, message, body} = response
        success({ res, body, message, status: statusCode});
        
      } else {
        const response = await this.valid_Username(String(Username));
        const {statusCode, message, body} = response
        success({ res, body, message, status: statusCode});
      }
      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  
  public updataRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedRecord = await this.updateByRegister(req.body);
      if (!updatedRecord) {
        error({ res, message: 'Record not found', status: 400, });
      } 
      
      const {statusCode, message, body} = updatedRecord
      success({ res, body, message, status: statusCode});      
      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

}



export default new historyRegisterController();
