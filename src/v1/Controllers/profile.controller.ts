import { Request, Response } from 'express';
import { ProfileService } from '../Services/profile.service';
import { success, error } from '../../middlewares/response';
import { Transaction } from 'sequelize';
class ProfileController extends ProfileService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const findList = await this._FindAll_Protected();
      
      success({ req, res, data: findList, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching record ', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const findData = await this._FindByPk_Protected(String(id));
      if (findData) {
        success({ req, res, data: findData, status: 200 });
      } else {
        success({ req, res, data: 'Record not found', status: 204 });            
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record ', status: 500, details: err });
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRecord = await this._Update_Protected(String(id), req.body); // Llamada al servicio
      if (updatedRecord) {
        success({ req, res, data: updatedRecord, status: 200 });
      } else {
        error({ req, res, data: 'Record  not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error updating record ', status: 500, details: err });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._Destroy_Protected(String(id)); // Llamada al servicio
      if (result) {
        success({ req, res, data: 'Record  deleted successfully', status: 200 });
      } else {
        error({ req, res, data: 'Record not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error deleting record ', status: 500, details: err });
    }
  }

}

export default new ProfileController();
