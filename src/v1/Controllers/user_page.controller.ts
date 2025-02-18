import { NextFunction, Request, Response } from 'express';
import { UserPageService } from '../Services/user_page.service';
import { successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';
import { UserPage } from '../models/user-page';
import { Transaction } from 'sequelize';
class UserPageController extends UserPageService {

  constructor() {
    super();  
  }

  public getAll = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const {body, message, status, error} = await this._findAll();
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public getById = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, status, error} = await this._findByPk(Number(id));
      if(error){ return errorResponse({res, message, status})}
      
      successResponse({ res, body, message, status});

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public updateById = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, status, error} = await this._updateUserPage(Number(id), req.body); // Llamada al servicio
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  } 

}

export default new UserPageController();
