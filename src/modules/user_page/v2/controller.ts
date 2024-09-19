import { Request, Response } from 'express';
import { UserPageService } from './service';
import { success, error } from '../../../middlewares/response';

class UserPageController extends UserPageService {

  constructor() {
    super();  // Compones el controlador inyectando el servicio
  }

  public getAllUserPages = async (req: Request, res: Response): Promise<void> => {
    try {
      const userPages = await this._getAllUserPages();
      success({ req, res, data: userPages, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching user pages', details: err, status: 500 });
    }
  }

  public getUserPageById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userPage = await this._getUserPageById(Number(id)); // Llamada al servicio
      if (userPage) {
        success({ req, res, data: userPage, status: 200 });
      } else {
        error({
          req,
          res,
          data: 'User page not found',
          status: 204
        });
      }
    } catch (err) {
      error({
        req,
        res,
        data: 'Error fetching user page',
        status: 500,
        details: err
      });
    }
  }

  public  createUserPage = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUserPage = await this._createUserPage(req.body); // Llamada al servicio
      success({ req, res, data: newUserPage, status: 201 });
    } catch (err) {
      error({
        req,
        res,
        data: 'Error creating user page',
        status: 500,
        details: err
      });
    }
  }

  public updateUserPage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedUserPage = await this._updateUserPage(Number(id), req.body); // Llamada al servicio
      if (updatedUserPage) {
        success({ req, res, data: updatedUserPage, status: 200 });
      } else {
        error({
          req,
          res,
          data: 'User page not found',
          status: 204,
        });
      }
    } catch (err) {
      error({
        req,
        res,
        data: 'Error updating user page',
        status: 500,
        details: err
      });
    }
  }

  public deleteUserPage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._deleteUserPage(Number(id)); // Llamada al servicio
      if (result) {
        success({ req, res, data: 'User page deleted successfully', status: 200 });
      } else {
        error({
          req,
          res,
          data: 'User page not found',
          status: 204,
        });
      }
    } catch (err) {
      error({
        req,
        res,
        data: 'Error deleting user page',
        status: 500,
        details: err
      });
    }
  }

}

export default new UserPageController();
