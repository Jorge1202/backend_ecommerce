import { NextFunction, Request, Response } from 'express';
import { NewUserService } from '../services/register.service';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import { CustomRequest } from '../../../common/interfaces/controller-response';
import { AuthPayload } from '../../../common/interfaces/tokens';


// {
//   "IdHistoryRegister": 1,
//   "Email": "jorge1.uaeh@gmail.com",
//   "Password": "123_Qwerty",
//   "Username": "jorge",
//   "Name": "Jorge",
//   "Firstname": "dias",
//   "Lastname": "noches",
//   "Phone": "string"
// }



class NewUserController extends NewUserService {

  constructor() {
    super();
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
      const response = await this.validEmailRegister(data, data.IdHistoryRegister);
      const { status, message, body } = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public postValidUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const { Username, IdHistoryRegister} = req.body;

      if(!Username){
        return ResponseHandler.error(res, 400, 'Se requiere el username');
      }
      if(!IdHistoryRegister){
        return ResponseHandler.error(res, 400, 'Se requiere el IdHistoryRegister');
      }
      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.verifyUsername(Username, IdHistoryRegister);
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

      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.newUserRegister(data);
      const { status, message, body } = response
      if(response.error){
        return ResponseHandler.error(res, response.status, response.message )
      }
      
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {Token} = req.body
      const {payload, token} = Token
      const dataTokenAuthUser = payload as AuthPayload
  
      // 2. Llamar al servicio para crear registro 
      // estatus 1
      const response = await this.verifyTokenRegister(dataTokenAuthUser, String(token));
      const {status, message, body} = response
      if(response.error){
        return ResponseHandler.error(res, response.status, response.message )
      }

      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  };

  public verifyCodeEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {Token} = req.body
      const {payload, token} = Token
      const dataTokenAuthUser = payload as AuthPayload
      
      const { Code } = req.body

      if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
          return ResponseHandler.error(res, 400, 'El código es requerido');
      }

      const response = await this.verifyCodeEmailRegister(dataTokenAuthUser, Code, token);
      const {status, message, body} = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public sendCodeAgain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const {Token} = req.body
      const {payload, token} = Token
      const dataTokenAuthUser = payload as AuthPayload

      const response = await this.sendCodeAgainRegister(dataTokenAuthUser, token);
      const {status, message, body} = response
      ResponseHandler.success(res, status, message, body);

    } catch (err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

}

export default new NewUserController();
