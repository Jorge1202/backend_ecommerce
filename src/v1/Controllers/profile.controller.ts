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
      const response = await this._findAllProfile();    
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const response = await this._findByPk(String(id));
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});
      
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._updateProfile(String(id), req.body); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});


    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._destroyProfile(String(id)); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

}

export default new ProfileController();
