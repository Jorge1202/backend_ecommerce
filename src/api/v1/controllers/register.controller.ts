import { NextFunction, Request, Response } from 'express';
import { NewUserService } from '../services/register.service';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import { CustomRequest } from '../../../common/interfaces/controller-response';
import { AuthPayload } from '../../../common/interfaces/auth';


class NewUserController extends NewUserService {

  constructor() {
    super();
  }

  public listaHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.listHistoryRegister();
      const { status, message, body } = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  public updateHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let data = req.body;
      console.log(data);

      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.updateHistoryRegister(data);
      const { status, message, body } = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }


  public validEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let data = req.body;

      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.validEmailRegister(data);
      const { status, message, body } = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  public newUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let data = req.body;
      console.log(data);

      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.newUserRegister(data);
      const { status, message, body } = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public verifyToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers['authorization']?.split(' ')[1];  // Obtiene el token del encabezado
      if (!token) {
        ResponseHandler.error(res, 401, 'Token required') // Responde y termina la solicitud si no hay token
      }

      const  {dataToken} = req
      const dataTokenAuthUser = dataToken as AuthPayload
  

      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.verifyTokenRegister(dataTokenAuthUser, String(token));
      const {status, message, body} = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  };

  public verifyCodeEmail = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dataToken } = req
      const dataTokenAuthUser = dataToken as AuthPayload
      const { Code } = req.body

      if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
          return ResponseHandler.error(res, 400, 'El código es requerido');
      }

      const response = await this.verifyCodeEmailRegister(dataTokenAuthUser, Code);
      const {status, message, body} = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }
  public sendCodeAgain = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

      const { dataToken } = req
      const dataTokenAuthUser = dataToken as AuthPayload

      const response = await this.sendCodeAgainRegister(dataTokenAuthUser);
      const {status, message, body} = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

}

export default new NewUserController();
