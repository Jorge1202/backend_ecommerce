import { Request, Response } from 'express';
import { success, error } from '../../middlewares/response';

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

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;

      // 1. Validación de datos
      const responseJson = await this._validDataCreate(res, data);
      if (!responseJson) return;

      // 2. Llamar al servicio para crear usuario 
      const response = await this._registerUser(data);
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

      
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  private _validDataCreate = async (res: Response, user: Record): Promise<boolean | null> => {
    try {
  
      if (!user) {
        error({ res, data: 'Faltan datos de usuario ', details:'(Controller.ValidDataCreate)', status: 400 });
        return false;
      }

      // Validación de campos obligatorios del usuario
      if (!user.Email) {
        error({ res, data: 'Ingresa el Email', details:'(Controller.ValidDataCreate)', status: 400, });
        return false;
      }
      if (!user.Username) {
        error({ res, data: 'Ingresa el username', details:'(Controller.ValidDataCreate)', status: 400, });
        return false;
      }
      if (!user.Name) {
        error({ res, data: 'Ingresa el nombre', details:'(Controller.ValidDataCreate)', status: 400, });
        return false;
      }
      if (!user.Firstname) {
        error({ res, data: 'Ingresa el apellido', details:'(Controller.ValidDataCreate)', status: 400, });
        return false;
      }

      if (!user.Password) {
        error({ res, data: 'Ingresa la contraseña', details:'(Controller.ValidDataCreate)', status: 400, });
        return false;
      }

      // Si todo está bien, retornamos los datos
      return true;
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });    
      return null;
    }
  }
  
  public sendMail = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;

      const response = await this._pruebaMail(data);
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});
      
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {

      const response = await this._findAll();
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this.findByPkUser(String(id));
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    
    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._updateUser(String(id), req.body); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this._destroyUser(String(id)); // Llamada al servicio
      const {code, message, isError} = response
      success({ res, data: message, status: code, isError});

    } catch(err: any) {
      error({ res, data: err.message, status: err.status, details: err });
    }
  }
}



export default new UserController();
