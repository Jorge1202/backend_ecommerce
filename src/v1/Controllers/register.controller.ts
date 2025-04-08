import { NextFunction, Request, Response } from 'express';
import { NewUserService } from '../Services/register.service';
import { CustomRequest, successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';
import { TokenAuthUser } from '../../Secure/interfaceToken';
import { DevicesCreationAttributes } from '../models/devices';
import { ParamsLogin } from '../Services/auth.service';
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
    //#region  ################ Generar cuenta 
    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let data = req.body;

            // 1. Validación de datos
            const responseJson = await this._validDataCreate(res, data);
            if (!responseJson) return;

            // 2. Llamar al servicio para crear usuario 
            const { body, message, status, error } = await this._registerUser(data);
            if (error) { return errorResponse({ res, message, status }) }

            successResponse({ res, body, message, status });


        } catch (err: any) {
            // Manejar errores llamando al middleware de errores
            next(err);
        }
    }

    public validCodeByEmail = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { tokenData } = req
            const dataTokenAuthUser = tokenData as TokenAuthUser
            const { Code } = req.body

            // if (!Email || (typeof Email === 'string' && Email.trim() === "")) {
            //   return errorResponse({res, message:'El Email es requerido', status:409});  
            // }


            if (!Code || (typeof Code === 'string' && Code.trim() === "")) {
                return errorResponse({ res, message: 'El código es requerido', status: 400 });
            }


            const { body, message, status, error } = await this._validCodeByEmail(dataTokenAuthUser, String(Code))
            if (error) { return errorResponse({ res, message, status }) }


            // Inicializar la variable para saber si se utilizará un token
            const deviceToken = undefined;
            let deviceInfo: DevicesCreationAttributes | undefined;
            deviceInfo = await this._getDataDevice(req);

            const dataEmail = body
            const loginParams: ParamsLogin = {
                Login: {
                    Username: String(dataEmail.Email),
                    Code: String(dataEmail.Code)
                },
                withToken: !!deviceToken,
                deviceToken,
                deviceInfo,
            };

            const response_loginAfter = await this.loginAfterRegister(loginParams);
            if (response_loginAfter.error) { return errorResponse({ res, message, status }) }

            return successResponse({
                res,
                status: response_loginAfter.status,
                message: response_loginAfter.message,
                body: response_loginAfter.body
            });

        } catch (err: any) {
            // Manejar errores llamando al middleware de errores
            next(err);
        }
    }

    public validViewVerifyEmail = async (req: CustomRequest, res: Response): Promise<void> => {

        const { tokenData } = req
        const dataTokenAuthUser = tokenData as TokenAuthUser

        const { body, message, status, error } = await this._validViewVerifyEmail(dataTokenAuthUser)
        if (error) { return errorResponse({ res, message, status }) }

        return successResponse({
            res,
            message: message,
            status: status,
            body: body
        });

    }

    public reSendCode = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { tokenData } = req
            const dataTokenAuthUser = tokenData as TokenAuthUser

            const { body, message, status, error } = await this._reSendCode(dataTokenAuthUser);
            if (error) { return errorResponse({ res, message, status }) }

            return successResponse({
                res,
                message: message,
                status: status,
                body: body
            });

        } catch (err: any) {
            // Manejar errores llamando al middleware de errores
            next(err);
        }
    }
    //#endregion  ################ Generar cuenta 

    private _validDataCreate = async (res: Response, user: Record) => {
        if (!user) {
            errorResponse({ res, message: 'Faltan datos de usuario ', status: 400 });
            return false;
        }

        // Validación de campos obligatorios del usuario
        if (!user.Email) {
            errorResponse({ res, message: 'Ingresa el Email', status: 400, });
            return false;
        }
        if (!user.Username) {
            errorResponse({ res, message: 'Ingresa el username', status: 400, });
            return false;
        }
        if (!user.Name) {
            errorResponse({ res, message: 'Ingresa el nombre', status: 400, });
            return false;
        }
        if (!user.Firstname) {
            errorResponse({ res, message: 'Ingresa el apellido', status: 400, });
            return false;
        }

        if (!user.Password) {
            errorResponse({ res, message: 'Ingresa la contraseña', status: 400, });
            return false;
        }
        return true

    }

    
    private _getDataDevice = async (req: Request): Promise<DevicesCreationAttributes> => {
        const userAgent = req.headers['user-agent'];

        const parser = new UAParser();
        const result = parser.setUA(userAgent).getResult();

        const _ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        return {
            UserAgent: userAgent,
            Plataform: result.os.name || 'Unknown',
            VersionPlataform: result.os.version || 'Unknown',
            Browser: result.browser.name || 'Unknown',
            Mobile: result.device.type === 'mobile',
            Location: req.body.location || 'Unknown',
            Ip: String(_ip) || 'Unknown',
            Cpu: result.cpu.architecture || 'Unknown',
        };
    }
}

export default new NewUserController();
