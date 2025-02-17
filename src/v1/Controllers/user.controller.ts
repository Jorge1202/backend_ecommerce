import { Request, Response } from 'express';
import { success, error } from '../../Utils/Response/response';

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
      const {body, message, statusCode}= await this._registerUser(data);
      success({ res, body, message, status: statusCode});

      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  private _validDataCreate = async (res: Response, user: Record): Promise<boolean | null> => {
    try {
  
      if (!user) {
        error({ res, message: 'Faltan datos de usuario ', status: 400 });
        return false;
      }

      // Validación de campos obligatorios del usuario
      if (!user.Email) {
        error({ res, message: 'Ingresa el Email', status: 400, });
        return false;
      }
      if (!user.Username) {
        error({ res, message: 'Ingresa el username', status: 400, });
        return false;
      }
      if (!user.Name) {
        error({ res, message: 'Ingresa el nombre', status: 400, });
        return false;
      }
      if (!user.Firstname) {
        error({ res, message: 'Ingresa el apellido', status: 400, });
        return false;
      }

      if (!user.Password) {
        error({ res, message: 'Ingresa la contraseña', status: 400, });
        return false;
      }

      // Si todo está bien, retornamos los datos
      return true;
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });    
      return null;
    }
  }
  
  public sendMail = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;

      const {body, message, statusCode} = await this._pruebaMail(data);
      success({ res, body, message, status: statusCode});
      
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {

      const {body, message, statusCode}  = await this._findAll();
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode}  = await this.findByPkUser(String(id));
      success({ res, body, message, status: statusCode});

    
    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode}  = await this._updateUser(String(id), req.body); // Llamada al servicio
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const {body, message, statusCode}  = await this._destroyUser(String(id)); // Llamada al servicio
      success({ res, body, message, status: statusCode});

    } catch(err: any) {
      error({ res, message: err.message, status: err.status });
    }
  }
}



export default new UserController();
