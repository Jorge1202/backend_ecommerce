import { Request, Response } from 'express';
import { UserService } from './service';
import { User } from '../../../models/user'; 
import { Auth } from '../../../models/auth'; 
import { success, error } from '../../../middlewares/response';
const bcrypt = require("bcrypt");


interface Record {
  user:User,
  auth:Auth,
}

class UserController extends UserService {

  constructor() {
    super();  // Compones el controlador inyectando el servicio
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const findList = await this._findAll();
      success({ res, data: findList, status: 200 });
    } catch (err) {
      error({ res, data: 'Error fetching record ', details: err, status: 500 });
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const findData = await this._findByPk(String(id));
      if (findData) {
        success({ res, data: findData, status: 200 });
      } else {
        error({ res, data: 'Record  not found', status: 204 });
      }
    } catch (err) {
      error({ res, data: 'Error fetching record ', status: 500, details: err});
    }
  }

  public  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const { user, auth } = data;

      const responseJson = await this.ValidDataCreate(res, data);
      if(responseJson){

        const newRecord = await this._create(data); // Llamada al servicio
        
        
        
        
        
        // const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
        const hashedPassword = await bcrypt.hash(auth.Password, 10);



        console.log(data);
        console.log(responseJson);
        
        // success({ res, data: newRecord, status: 201 });
      }
    } catch (err) {
      error({ res, data: 'Error creating record ', status: 500, details: err });
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRecord = await this._update(String(id), req.body); // Llamada al servicio
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
      const result = await this._destroy(String(id)); // Llamada al servicio
      if (result) {
        success({ res, data: 'Record  deleted successfully', status: 200 });
      } else {
        error({ res, data: 'Record not found', status: 204,});
      }
    } catch (err) {
      error({ res, data: 'Error deleting record ', status: 500, details: err });
    }
  }

  private ValidDataCreate = async (res: Response, data: Record): Promise<boolean | null> => {
    try {
      const { user, auth } = data;
  
      // Validación de campos obligatorios del usuario
      if (!user.Email) {
        error({ res, data: 'Ingresa el Email', status: 422 });
      }
      if (!user.Username) {
        error({ res, data: 'Ingresa el username', status: 422 });
      }
      if (!user.Name) {
        error({ res, data: 'Ingresa el nombre', status: 422 });
      }
      if (!user.Firstname) {
        error({ res, data: 'Ingresa el apellido', status: 422 });
      }

      if (!auth.Password) {
        error({ res, data: 'Ingresa la contraseña', status: 422 });
      }
  
      // Si todo está bien, retornamos los datos
      return true;
    } catch (err) {
      error({ res, data: 'Error validando los datos', status: 400, details: err });
      return null;
    }
  };
  

}



export default new UserController();
