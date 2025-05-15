import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import { CustomRequest } from '../../../common/interfaces/controller-response';
import { AuthPayload } from '../../../common/interfaces/tokens';
import {TokenService} from '../services/test.service'

class TestController extends TokenService {

    constructor(){
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
    public getlistaAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          // 2. Llamar al servicio para crear registro 
          // estatus 1
          const response = await this.listAuth();
          const { status, message, body } = response
          ResponseHandler.success(res, status, message, body);
    
        } catch (err: any) {
          // Manejar errores llamando al middleware de errores
          next(err);
        }
    }        
}

export default new TestController();