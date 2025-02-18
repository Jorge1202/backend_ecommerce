import { NextFunction, Request, Response } from 'express';
import { TypePageService } from '../Services/type_page.service';
import { successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';

class TypePageController extends TypePageService {

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

  public  create = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const {body, message, status, error} = await this._createTypePage(req.body); // Llamada al servicio
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
      const {body, message, status, error} = await this._updateTypePage(Number(id), req.body); // Llamada al servicio
      if(error){ return errorResponse({res, message, status})}
      successResponse({ res, body, message, status});  

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public deleteById = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, status, error} = await this._destroyTypePage(Number(id)); // Llamada al servicio
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});  

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

}

export default new TypePageController();
