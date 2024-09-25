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
      const userPages = await this._findAll();
      success({ req, res, data: userPages, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching user pages', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userPage = await this._findByPk(Number(id));
      
      if (userPage) {
        success({ req, res, data: userPage, status: 200 });
      } else {
    
        success({ req, res, data: 'Record not found', status: 204});
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record', status: 500, details: err });
    }
  }

  public getByUsername = async (username:string): Promise<UserPage | null> => {
    try {
      const userPage = await this._findByUsername(String(username));
      return userPage
    } catch (err) {
      throw new Error(`Error obteniendo el registro con USERNAME ${username}: ${error}`);
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedUserPage = await this._update(Number(id), req.body); // Llamada al servicio
      if (updatedUserPage) {
        success({ req, res, data: updatedUserPage, status: 200 });
      } else {
        error({ req, res, data: 'Record not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error updating record', status: 500, details: err });
    }
  }

}

export default new UserPageController();
