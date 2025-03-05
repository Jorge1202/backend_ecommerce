import { NextFunction, Request, Response } from 'express';
import { PasswordService } from '../Services/password.service';
import { CustomRequest, successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';
import { TokenAuthUser, TokenLogin, TokenRefresh } from '../../Secure/interfaceToken';


class PasswordController extends PasswordService {

  constructor() {
    super();  
  }
    public validCodePassword = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const {tokenData} = req
        const dataTokenAuthUser = tokenData as TokenAuthUser
  
  
        const {Code} = req.body        
        const {body, message, status, error} = await this._validCode(Code, dataTokenAuthUser)
        if(error){ return errorResponse({res, message, status})}
  
        return successResponse({ res, body, message, status});  
        
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
  
  
    }
    public changePassword = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const {tokenData} = req
        const dataTokenAuthUser = tokenData as TokenAuthUser
  
        const {Password} = req.body        
        const {body, message, status, error} = await this._changePassword(Password, dataTokenAuthUser)
        if(error){ return errorResponse({res, message, status})}
  
        return successResponse({ res, body, message, status});  
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
    }
    public validDataUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
      try {      
  
        const {tokenData} = req
        const dataTokenAuthUser = tokenData as TokenAuthUser
  
  
        const {body, message, status, error} = await this._validDataUser(dataTokenAuthUser)
        if(error){ return errorResponse({res, message, status})} 
  
        return successResponse({ res, 
          body: body,
          message: message, 
          status: status
        }); 
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
    }
    public recoveryPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        let info = req.body;
        const {Email} = info
  
        const {body, status, message, error} = await this._recoveryPassword(Email);
        if(error){ return errorResponse({res, message, status})}
  
        return successResponse({ res, message, status, body});
        
      } catch (err:any) {
        // Manejar errores llamando al middleware de errores
        next(err);
      }
    }
}

export default new PasswordController();
