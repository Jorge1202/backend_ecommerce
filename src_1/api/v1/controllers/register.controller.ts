import { NextFunction, Request, Response } from 'express';
import { NewUserService } from '../services/register.service';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import { CustomRequest } from '../../shared/interfaces/newUser';
import { TokenValidEmail } from '../../shared/interfaces/newUser';

const UAParser = require('ua-parser-js');


interface Record {
    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    Email: string;
    Phone: string;
    Password: string;
}

class NewUserController extends NewUserService {

    constructor() {
        super();
    }

    public listaHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {    
          // 2. Llamar al servicio para crear registro 
          // estatus 1
          const response = await this.listHistoryRegister();
          const {status, message, body} = response
          ResponseHandler.success(res, status, message, body);
          
        } catch (err:any) {
          // Manejar errores llamando al middleware de errores
          next(err);
        }
    }
    public createHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          let data = req.body;
          console.log(data); 
    
          // 2. Llamar al servicio para crear registro 
          // estatus 1
          const response = await this.createHistoryRegister(data);
          const {status, message, body} = response
          ResponseHandler.success(res, status, message, body);
          
        } catch (err:any) {
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
          const {status, message, body} = response
          ResponseHandler.success(res, status, message, body);
          
        } catch (err:any) {
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
        const {status, message, body} = response
        ResponseHandler.success(res, status, message, body);
        
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
    }
    public verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        let data = req.body;
        console.log(data); 
  
        // 2. Llamar al servicio para crear registro 
        // estatus 1
        const response = await this.verifyTokenRegister(data);
        const {status, message, body} = response
        ResponseHandler.success(res, status, message, body);
        
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
    }
    public verifyCodeEmail = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { tokenData } = req
        const dataTokenAuthUser = tokenData as TokenValidEmail
        const { Code } = req.body
  
        if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
            return ResponseHandler.error(res, 400, 'El código es requerido');
        }

        const response = await this.verifyCodeEmailRegister(dataTokenAuthUser, Code);
        const {status, message, body} = response
        ResponseHandler.success(res, status, message, body);
        
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
    }

}

export default new NewUserController();
