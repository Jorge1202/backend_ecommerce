import { NextFunction, Request, Response } from 'express';
import { LoginService } from '../Services/login.service';
import { CustomRequest, successResponse, errorResponse } from '../../Utils/Response/ControllerResponse';
import { generateCookieTokenRefresh, generateCookieTokenDevice, actionType } from '../../Secure/generateTokens';
import { DevicesCreationAttributes } from '../models/devices';
import { ParamsLogin } from '../Services/auth.service';
import { TokenAuthUser } from '../../Secure/interfaceToken';

const UAParser = require('ua-parser-js');

class LoginController extends LoginService {

    constructor() {
        super();
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // const { Username, Password } = req.body;
        const { Username, Password } = req.body;

        const _Username = String(Username)
        const _Password = String(Password)

        try {
            // Validar que username y password están presentes
            if (!_Username) {
                return errorResponse({ res, message: 'El nombre de usuario es requerido', status: 400 });
            }

            if (!_Password) {
                return errorResponse({ res, message: 'La contraseña es requerida', status: 400 });
            }

            // Inicializar la variable para saber si se utilizará un token
            const deviceToken = req.cookies?.[actionType.DEVICE];
            let deviceInfo: DevicesCreationAttributes | undefined;

            // Si no hay token, obtener la información del dispositivo
            if (!deviceToken) {
                deviceInfo = await this._getDataDevice(req);
            }

            // Llamar al servicio de login con los datos correspondientes
            const loginParams: ParamsLogin = {
                Login: {
                    Username: _Username,
                    Password: _Password
                },
                withToken: !!deviceToken,  //asigna true si existe token
                deviceToken,
                deviceInfo,
            };
            const { body, tokens, message, status, error } = await this._login(loginParams)
            if (error) { return errorResponse({ res, message, status }) }

            // Establecer la cookie HttpOnly con el token
            if (tokens) {
                const { TOKEN_REFRESH, TOKEN_DEVICE } = tokens

                if (TOKEN_REFRESH) {
                    await generateCookieTokenRefresh(res, TOKEN_REFRESH)
                }

                if (TOKEN_DEVICE) {
                    await generateCookieTokenDevice(res, TOKEN_DEVICE)
                }
            }

            return successResponse({
                res,
                message,
                body,
                status
            })

        } catch (err: any) {
            // Manejar errores llamando al middleware de errores
            next(err);
        }

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

    public validViewNewDevice = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { tokenData } = req
            const dataTokenAuthUser = tokenData as TokenAuthUser


            const { body, message, status, error } = await this.fc_validViewNewDevice(dataTokenAuthUser)
            if (error) { return errorResponse({ res, message, status }) }

            return successResponse({
                res,
                message,
                status,
                body: body
            });

        } catch (err: any) {
            // Manejar errores llamando al middleware de errores
            next(err);
        }
    }

    public validCodeDevice = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { tokenData } = req
            const dataTokenAuthUser = tokenData as TokenAuthUser


            const { Code } = req.body;
            if (!Code) {
                return errorResponse({ res, message: 'Código no exite', status: 400 });
            }

            let deviceInfo: DevicesCreationAttributes;
            deviceInfo = await this._getDataDevice(req);

            const { body, tokens, message, status, error } = await this.lg_validCodeDevice(Code, dataTokenAuthUser, deviceInfo)
            if (error) { return errorResponse({ res, message, status }) }

            if (tokens) {
                const { TOKEN_REFRESH, TOKEN_DEVICE } = tokens


                if (TOKEN_REFRESH) {
                    generateCookieTokenRefresh(res, TOKEN_REFRESH)
                }

                if (TOKEN_DEVICE) {
                    generateCookieTokenDevice(res, TOKEN_DEVICE)
                }
            }

            return successResponse({
                res,
                body,
                message,
                status
            });

        } catch (err: any) {
            // Manejar errores llamando al middleware de errores
            next(err);
        }
    }

    public newCode_NewDevice = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { tokenData } = req
            const dataTokenAuthUser = tokenData as TokenAuthUser

            const { body, message, status, error } = await this.fc_newCode_NewDevice(dataTokenAuthUser)
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

}

export default new LoginController();
