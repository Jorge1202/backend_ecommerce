import { NextFunction, Request, Response } from 'express';
import { ProfileService } from '../Services/profile.service';
import { successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';
class ProfileController extends ProfileService {

  constructor() {
    super(); 
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {status, message, body, error} = await this._findAllProfile();   
      if(error){return errorResponse({ res, message, status })}
        

      successResponse({ res, body, message, status});

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      const {status, message, body, error} = await this._findByPk(String(id));
      if(error){return errorResponse({ res, message, status })}

      successResponse({ res, body, message, status});
      
    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  
  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const {status, message, body, error}  = await this._updateProfile(String(id), req.body); // Llamada al servicio      
      if(error){return errorResponse({ res, message, status })}

      successResponse({ res, body, message, status});


    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, status, error} = await this._destroyProfile(String(id)); // Llamada al servicio
      if(error){return errorResponse({ res, message, status })}

      successResponse({ res, body, message, status});

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

}

export default new ProfileController();
