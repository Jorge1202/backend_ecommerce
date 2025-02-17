import { Request, Response } from 'express';
import { UserPageService } from '../Services/user_page.service';
import { success, error } from '../../Utils/Response/response';
import { UserPage } from '../models/user-page';
import { Transaction } from 'sequelize';
class UserPageController extends UserPageService {

  constructor() {
    super();  
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const {body, message, statusCode} = await this._findAll();
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._findByPk(Number(id));
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode} = await this._updateUserPage(Number(id), req.body); // Llamada al servicio
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  } 

}

export default new UserPageController();
