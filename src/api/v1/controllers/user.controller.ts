import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import { TokenAccess } from '../../../common/interfaces/tokens';
import {UserService} from '../services/user.service'

class TestController extends UserService {

    constructor(){
        super();
    }

    public getHeader = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {Token} = req.body
            const {payload} = Token
            const dataTokenAuthUser = payload as TokenAccess

            const response = await this.header(dataTokenAuthUser)
            const {error, status, message, body} = response 

            if(error){
                return ResponseHandler.error(res, status, message);
            }


            ResponseHandler.success(res, status, message, body);

        } catch (err: any) {
          // Manejar errores llamando al middleware de errores
          next(err);
        }
    }
    public getAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {Token} = req.body
            const {payload, token} = Token
            const dataTokenAuthUser = payload as TokenAccess

            const response = await this.address(dataTokenAuthUser)
            const {error, status, message, body} = response 
            if(error){
                return ResponseHandler.error(res, status, message);
            }

            ResponseHandler.success(res, status, message, body);

        } catch (err: any) {
          // Manejar errores llamando al middleware de errores
          next(err);
        }
    }        
}

export default new TestController();