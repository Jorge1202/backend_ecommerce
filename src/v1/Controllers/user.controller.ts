import { Request, Response } from 'express';
import { success, error } from '../../middlewares/response';

import { UserService } from '../Services/user.service';
import UserPageController from './user_page.controller';
interface Record {
  user: {
    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    Email: string;
    Phone: string;
    Password: string;
  };
}

class UserController extends UserService {

  constructor() {
    super(); 
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;

      // 1. Validación de datos
      const responseJson = await this._privateValidDataCreate(res, data);
      if (!responseJson) return;

      // 2. Llamar al servicio para crear usuario 
      const rsponse = await this._RegisterUser_Protected(data);

      // success({ res, data: 'Registro exitoso. El usuario se ha creado correctamente.', status: 201 });
      success({ res, data: rsponse, status: 201 });
      
    } catch (err) {
      // await transaction.rollback(); // Revertir las operaciones en caso de error
    error({ res, data: 'Error creating record', status: 500, details: err });
    }
  }

  private _privateValidDataCreate = async (res: Response, data: Record): Promise<boolean | null> => {
    try {
      const { user } = data;
  
      if (!user) {
        error({ res, data: 'Faltan datos de usuario o autenticación', details:'(Controller.ValidDataCreate)', status: 400 });
        return false;
      }

      // Validación de campos obligatorios del usuario
      const newUserPage = await UserPageController.getByUsername(user.Username);
      if(newUserPage){
        error({ res, data: 'El username ya se encuentra en uso', status: 409 });
        return false;
      }

      if (!user.Email) {
        error({ res, data: 'Ingresa el Email', details:'(Controller.ValidDataCreate)', status: 422, });
        return false;
      }
      if (!user.Username) {
        error({ res, data: 'Ingresa el username', details:'(Controller.ValidDataCreate)', status: 422, });
        return false;
      }
      if (!user.Name) {
        error({ res, data: 'Ingresa el nombre', details:'(Controller.ValidDataCreate)', status: 422, });
        return false;
      }
      if (!user.Firstname) {
        error({ res, data: 'Ingresa el apellido', details:'(Controller.ValidDataCreate)', status: 422, });
        return false;
      }

      if (!user.Password) {
        error({ res, data: 'Ingresa la contraseña', details:'(Controller.ValidDataCreate)', status: 422, });
        return false;
      }
  
      // Si todo está bien, retornamos los datos
      return true;
    } catch (err) {
      error({ res, data: 'Error validando los datos', status: 400, details: err });
      return null;
    }
  }
  
  public sendMail = async (req: Request, res: Response): Promise<void> => {
    try {
      let data = req.body;

      const response = await this._PruebaMail_Protected(data);

      success({ res, data: response, status: 200 });
      
    } catch (err) {
      // await transaction.rollback(); // Revertir las operaciones en caso de error
    error({ res, data: 'Error al enviar el correo prueba', status: 500, details: err });
    }
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {

      const findList = await this._FindAll_Protected();

      success({ res, data: findList, status: 200 });
    } catch (err) {
      error({ res, data: 'Error fetching record ', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const findData = await this.findByPk(String(id));
      if (findData) {
        success({ res, data: findData, status: 200 });
      } else {
        error({ res, data: 'Record  not found', status: 204 });
      }
    } catch (err) {
      error({ res, data: 'Error fetching record ', status: 500, details: err});
    }
  }
  
  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRecord = await this._Update_Protected(String(id), req.body); // Llamada al servicio
      if (updatedRecord) {
        success({ res, data: updatedRecord, status: 200 });
      } else {
        error({ res, data: 'Record not found', status: 204, });
      }
    } catch (err) {
      error({ res, data: 'Error updating record ', status: 500, details: err });
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this._ProtectedDestroy(String(id)); // Llamada al servicio
      if (result) {
        success({ res, data: 'Record  deleted successfully', status: 200 });
      } else {
        error({ res, data: 'Record not found', status: 204,});
      }
    } catch (err) {
      error({ res, data: 'Error deleting record ', status: 500, details: err });
    }
  }
}



export default new UserController();
