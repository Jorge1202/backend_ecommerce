import { Request, Response } from 'express';
import { UserPageService } from './service';
import { success, error } from '../../../middlewares/response';

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
      console.log(userPage);
      
      if (userPage) {
        success({ req, res, data: userPage, status: 200 });
      } else {
    
        success({ req, res, data: 'Record not found', status: 204});
      }
    } catch (err) {
      error({ req, res, data: 'Error fetching record', status: 500, details: err });
    }
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUserPage = await this._create(req.body); // Llamada al servicio
      success({ req, res, data: newUserPage, status: 201 });
    } catch (err) {
      error({ req, res, data: 'Error creating record', status: 500, details: err });
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

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._destroy(Number(id)); // Llamada al servicio
      if (result) {
        success({ req, res, data: 'User page deleted successfully', status: 200 });
      } else {
        error({ req, res, data: 'User page not found', status: 204, });
      }
    } catch (err) {
      error({ req, res, data: 'Error deleting user page', status: 500, details: err });
    }
  }

}

export default new UserPageController();
