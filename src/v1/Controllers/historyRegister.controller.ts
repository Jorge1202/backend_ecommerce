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
      const rsponse = await this._createHistory(data);

      success({ res, data: rsponse, status: 201 });
      
    } catch (err) {
      error({ res, data: 'Error creating record', status: 500, details: err });
    }
  }


  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      const findData = await this._findByEmail(String(email));
      if (findData) {
        success({ res, data: findData, status: 200 });
      } else {
        error({ res, data: 'Record  not found', status: 204 });
      }
    } catch (err) {
      error({ res, data: 'Error fetching record ', status: 500, details: err});
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      const updatedRecord = await this.updateByUsername(String(email), req.body);
      if (updatedRecord) {
        success({ res, data: updatedRecord, status: 200 });
      } else {
        error({ res, data: 'Record not found', status: 204, });
      }
    } catch (err) {
      error({ res, data: 'Error updating record ', status: 500, details: err });
    }
  }




}



export default new historyRegisterController();
