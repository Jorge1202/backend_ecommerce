import { Request, Response } from 'express';
import { ProfileService } from '../Services/profile.service';
import { success, error } from '../../Utils/Response/response';
import { Transaction } from 'sequelize';
class ProfileController extends ProfileService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const {body, message, statusCode} = await this._findAllProfile();   
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const {body, message, statusCode} = await this._findByPk(String(id));
      success({ res, body, message, status: statusCode});
      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._updateProfile(String(id), req.body); // Llamada al servicio
      success({ res, body, message, status: statusCode});


    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._destroyProfile(String(id)); // Llamada al servicio
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

}

export default new ProfileController();
