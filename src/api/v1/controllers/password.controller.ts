import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../../common/interfaces/controller-response';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import { AuthPayload } from '../../../common/interfaces/tokens';

import {PasswordService} from '../services/password.service'
const UAParser = require('ua-parser-js');

class PasswordController extends PasswordService {

    constructor(){
        super();
    }

    public postValidUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {Email} = req.body

            const { status,message, error, body } = await this.validUser(Email)

            if(error){ return ResponseHandler.error(res, status, message)}
            
            return ResponseHandler.success(res, status, message, body);

        } catch (err:any) {
            next(err);
        }
    }

    public postRecovery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {Email} = req.body

            const { status,message, error, body } = await this.recovery(Email)

            if(error){ return ResponseHandler.error(res, status, message)}
            
            return ResponseHandler.success(res, status, message, body);

        } catch (err:any) {
            next(err);
        }
    }

    public getVerifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {Token} = req.body
            const {payload, token} = Token
            const dataTokenAuthUser = payload as AuthPayload

            const { status,message, error } = await this.verifyToken(dataTokenAuthUser)

            if(error){ return ResponseHandler.error(res, status, message)}
            
            return ResponseHandler.success(res, status, message);
        } catch (err:any) {
            next(err);
        }
    }

    public postValidCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {      
            const {Token, Code} = req.body
            const {payload, token} = Token
            const dataTokenAuthUser = payload as AuthPayload
                    
            const { status,message, error } = await this.validCode(dataTokenAuthUser, String(Code), String(token))

            if(error){ return ResponseHandler.error(res, status, message)}
            
            return ResponseHandler.success(res, status, message);
        } catch (err:any) {
            next(err);
        }
    }

    public putChangePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const {Token, Password} = req.body
            const {payload, token} = Token
            const dataTokenAuthUser = payload as AuthPayload

            const { status,message, error, body } = await this.changePassword(dataTokenAuthUser, String(Password), String(token))

            if(error){ return ResponseHandler.error(res, status, message)}
            
            return ResponseHandler.success(res, status, message, body);
        } catch (err:any) {
            next(err);
        }
    }

    public getNewCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {Token} = req.body
            const {payload, token} = Token
            const dataTokenAuthUser = payload as AuthPayload
            
            
            const { status,message, body, error } = await this.newCode(dataTokenAuthUser, String(token))

            if(error){ return ResponseHandler.error(res, status, message)}
            
            return ResponseHandler.success(res, status, message, body);
        } catch (err:any) {
            next(err);
        }
    }
    
}

export default new PasswordController();

// try {

//     const status=200
//     const message=''
//     const body= ''
//     const error = true;
//     if(error){ return ResponseHandler.error(res, status, message)}
    
//     return ResponseHandler.success(res, status, message, body);
// } catch (err:any) {
//     next(err);
// }