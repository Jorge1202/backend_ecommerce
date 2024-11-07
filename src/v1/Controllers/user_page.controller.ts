import { Request, Response } from 'express';
import { UserPageService } from '../Services/user_page.service';
import { success, error } from '../../middlewares/response';
import { UserPage } from '../models/user-page';
import { Transaction } from 'sequelize';
class UserPageController extends UserPageService {

  constructor() {
    super();  
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this._findAll();
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch (err) {
      error({ req, res, data: 'Error fetching user pages', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._findByPk(Number(id));
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch (err) {
      error({ req, res, data: 'Error fetching record', status: 500, details: err });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._updateUserPage(Number(id), req.body); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch (err) {
      error({ req, res, data: 'Error updating record', status: 500, details: err });
    }
  } 

}

export default new UserPageController();
