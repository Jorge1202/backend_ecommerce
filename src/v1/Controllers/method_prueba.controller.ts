import { NextFunction, Request, Response } from 'express';
import { MethodPruebaService } from '../Services/method_prueba.service';
import { successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';

class MethodPruebaController extends MethodPruebaService {

  constructor() {
    super();  
  }

  public sendMail = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
      let data = req.body;
      if(!data){
        return errorResponse({ res, message:"Faltan datos", status:400 })
      }

      const {body, message, status, error} = await this._pruebaMail(data);
      if(error){ return errorResponse({res, message, status})}

      successResponse({ res, body, message, status});
      
    } catch(err: any) {
      // Manejar errores llamando al middleware de errores
      next(err);
    }
  }

  public methodPruebaErrores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {Code} = req.query
      if(!Code){
        return errorResponse({ res, message:"Faltan datos", status:400 })
      }

      const { body, message, status, error } = await this._methodPruebaErrores(Number(Code))
      if(error){return errorResponse({ res, message, status })}

      return successResponse({ res, 
        status,
        message, 
        body
      });

    } catch (err:any) {      
      // Manejar errores llamando al middleware de errores
      next(err);
    }    
  }

}

export default new MethodPruebaController();
