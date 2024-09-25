import { Request, Response } from 'express';
import { success, error } from '../../middlewares/response';

import { User } from '../models/user'; 
import { Auth } from '../models/auth'; 

import { UserService } from '../Services/user.service';
import UserPageController from './user_page.controller';
interface Record {
  user:User,
  auth:Auth,
}

class UserController extends UserService {

  constructor() {
    super(); 
  }

  public  create = async (req: Request, res: Response): Promise<void> => {
    // const transaction = await sequelize.transaction(); // Inicia la transacción
    try {
      let data = req.body;
      // const { user, auth } = data;

      // 1. Validación de datos
      const responseJson = await this.ValidDataCreate(res, data);
      if (!responseJson) return;

      // 2. Llamar al servicio para crear usuario 
      const rsponse = await this.registerUser(data);

      // success({ res, data: 'Registro exitoso. El usuario se ha creado correctamente.', status: 201 });
      success({ res, data: rsponse, status: 201 });

      // // 4. Crear autenticación
      // await this._createUserAuth(newUser, auth, transaction);

      // // 5. Crear perfil
      // await this._createUserProfile(newUser, newUserPage, transaction);

      // // Confirma todas las operaciones
      // await transaction.commit();

      // success({ res, data: 'Registro exitoso. El usuario se ha creado correctamente.', status: 201 });
      
    } catch (err) {
      // await transaction.rollback(); // Revertir las operaciones en caso de error
    error({ res, data: 'Error creating record', status: 500, details: err });
    }
  }

  // public getAll = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const findList = await this._findAll();
  //     success({ res, data: findList, status: 200 });
  //   } catch (err) {
  //     error({ res, data: 'Error fetching record ', details: err, status: 500 });
  //   }
  // }

  // public getById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const findData = await this._findByPk(String(id));
  //     if (findData) {
  //       success({ res, data: findData, status: 200 });
  //     } else {
  //       error({ res, data: 'Record  not found', status: 204 });
  //     }
  //   } catch (err) {
  //     error({ res, data: 'Error fetching record ', status: 500, details: err});
  //   }
  // }
  
  // public updateById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const updatedRecord = await this._update(String(id), req.body); // Llamada al servicio
  //     if (updatedRecord) {
  //       success({ res, data: updatedRecord, status: 200 });
  //     } else {
  //       error({ res, data: 'Record not found', status: 204, });
  //     }
  //   } catch (err) {
  //     error({ res, data: 'Error updating record ', status: 500, details: err });
  //   }
  // }

  // public deleteById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params;
  //     const result = await this._destroy(String(id)); // Llamada al servicio
  //     if (result) {
  //       success({ res, data: 'Record  deleted successfully', status: 200 });
  //     } else {
  //       error({ res, data: 'Record not found', status: 204,});
  //     }
  //   } catch (err) {
  //     error({ res, data: 'Error deleting record ', status: 500, details: err });
  //   }
  // }

  private ValidDataCreate = async (res: Response, data: Record): Promise<boolean | null> => {
    try {
      const { user, auth } = data;
  
      if (!user || !auth) {
        error({ res, data: 'Faltan datos de usuario o autenticación', status: 400 });
        return false;
      }

      // Validación de campos obligatorios del usuario
      const newUserPage = await UserPageController.getByUsername(user.Username);
      if(newUserPage){
        error({ res, data: 'El username ya se encuentra en uso', status: 409 });
        return false;
      }

      if (!user.Email) {
        error({ res, data: 'Ingresa el Email', status: 422 });
        return false;
      }
      if (!user.Username) {
        error({ res, data: 'Ingresa el username', status: 422 });
        return false;
      }
      if (!user.Name) {
        error({ res, data: 'Ingresa el nombre', status: 422 });
        return false;
      }
      if (!user.Firstname) {
        error({ res, data: 'Ingresa el apellido', status: 422 });
        return false;
      }

      if (!auth.Password) {
        error({ res, data: 'Ingresa la contraseña', status: 422 });
        return false;
      }
  
      // Si todo está bien, retornamos los datos
      return true;
    } catch (err) {
      error({ res, data: 'Error validando los datos', status: 400, details: err });
      return null;
    }
  };

  // private async _createUser(user: User, transaction: Transaction): Promise<User> {
  //   // return await this._create(user, {transaction});
  //   return await this._create(user, transaction);
  // }

  // private async _createUserPage(user: User, transaction: Transaction): Promise<UserPage> {
  //   const userPageData = { IdUser: user.IdUser, Username: user.Username, IdTypePage: 1 };
  //   return await UserPageController.create({ body: { userPage: userPageData } } as Request, {} as Response, transaction);
  // }

  // private async _createUserAuth(user: User, auth: Auth, transaction: Transaction): Promise<void> {
  //   await AuthController.create({ body: { auth: { Password: auth.Password, IdUser: user.IdUser } } } as Request, {} as Response , transaction);
  // }

  // private async _createUserProfile(user: User, userPage: UserPage, transaction: Transaction): Promise<void> {
  //   const profileData = {
  //     Name: user.Name,
  //     Firstname: user.Firstname,
  //     Lastname: user.Lastname || '',
  //     Email: user.Email,
  //     Phone: user.Phone || '',
  //     ProfilePicture: "https://example.com/profile.jpg",
  //     PortadaPicture: "https://example.com/cover.jpg",
  //     IdUserPage: userPage.IdUserPage
  //   };
  //   await ProfileController.create({ body: { profile: profileData } } as Request, {} as Response, transaction);
  // }
}



export default new UserController();
