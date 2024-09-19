import { Request, Response } from 'express';
import { UserService } from './service';
import { success, error } from '../../../middlewares/response';

class UserController extends UserService {

  constructor() {
    super();  // Compones el controlador inyectando el servicio
  }

  public getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this._getAllUser();
      success({ req, res, data: user, status: 200 });
    } catch (err) {
      error({ req, res, data: 'Error fetching user ', details: err, status: 500 });
    }
  }

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this._getUserById(String(id));
      if (user) {
        success({ req, res, data: user, status: 200 });
      } else {
        error({
          req,
          res,
          data: 'User  not found',
          status: 204
        });
      }
    } catch (err) {
      error({
        req,
        res,
        data: 'Error fetching user ',
        status: 500,
        details: err
      });
    }
  }

  public  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await this._createUser(req.body); // Llamada al servicio
      success({ req, res, data: newUser, status: 201 });
    } catch (err) {
      error({
        req,
        res,
        data: 'Error creating user ',
        status: 500,
        details: err
      });
    }
  }

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedUser = await this._updateUser(String(id), req.body); // Llamada al servicio
      if (updatedUser) {
        success({ req, res, data: updatedUser, status: 200 });
      } else {
        error({
          req,
          res,
          data: 'User  not found',
          status: 204,
        });
      }
    } catch (err) {
      error({
        req,
        res,
        data: 'Error updating user ',
        status: 500,
        details: err
      });
    }
  }

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._deleteUser(String(id)); // Llamada al servicio
      if (result) {
        success({ req, res, data: 'User  deleted successfully', status: 200 });
      } else {
        error({
          req,
          res,
          data: 'User  not found',
          status: 204,
        });
      }
    } catch (err) {
      error({
        req,
        res,
        data: 'Error deleting user ',
        status: 500,
        details: err
      });
    }
  }

}

export default new UserController();
