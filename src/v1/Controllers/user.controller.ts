import { NextFunction, Request, Response } from 'express';
import { successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';

import { UserService } from '../Services/user.service';
interface Record {
    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    Email: string;
    Phone: string;
    Password: string;
}

class UserController extends UserService {

  constructor() {
    super(); 
  }

  public create = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      let data = req.body;

      // 1. Validación de datos
      const responseJson = await this._validDataCreate(res, data);
      if (!responseJson) return;

      // 2. Llamar al servicio para crear usuario 
      const {body, message, status, error}= await this._registerUser(data);
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});

      
    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  private _validDataCreate = async (res: Response, user: Record) => {
    if (!user) {
      errorResponse({ res, message: 'Faltan datos de usuario ', status: 400 });
      return false;
    }

    // Validación de campos obligatorios del usuario
    if (!user.Email) {
      errorResponse({ res, message: 'Ingresa el Email', status: 400, });
      return false;
    }
    if (!user.Username) {
      errorResponse({ res, message: 'Ingresa el username', status: 400, });
      return false;
    }
    if (!user.Name) {
      errorResponse({ res, message: 'Ingresa el nombre', status: 400, });
      return false;
    }
    if (!user.Firstname) {
      errorResponse({ res, message: 'Ingresa el apellido', status: 400, });
      return false;
    }

    if (!user.Password) {
      errorResponse({ res, message: 'Ingresa la contraseña', status: 400, });
      return false;
    }
    
  }

  public getAll = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {

      const {body, message, status, error}  = await this._findAll();
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
      const {body, message, status, error}  = await this.findByPkUser(String(id));
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
      const {body, message, status, error}  = await this._updateUser(String(id), req.body); // Llamada al servicio
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
      const {body, message, status, error}  = await this._destroyUser(String(id)); // Llamada al servicio
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});

    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
}



export default new UserController();
