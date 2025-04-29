import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../../../common/interfaces/controller-response';
import { AuthPayload } from '../../../common/interfaces/tokens';
import { DevicesCreationAttributes } from '../models/devices';
import { ResponseHandler } from '../../../common/utils/response-controller/response-handler';
import {AuthService} from '../services/auth.service'
import { generateCookieTokenDevice, generateCookieTokenRefresh, actionType } from '../../../common/utils/generateCookies';

const UAParser = require('ua-parser-js');

class AuthController extends AuthService {

    constructor() {
        super();
    }
    
    public postLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{

    }

    public postLoginByHash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {            
            const {Token} = req.body
            const {payload, token} = Token
            const dataTokenAuthUser = payload as AuthPayload

            let deviceInfo: DevicesCreationAttributes;
            deviceInfo = await this._getDataDevice(req);       
                
            const response = await this.loginByHash(dataTokenAuthUser, String(token), deviceInfo);
            const { status, message, error } = response        
            if (error) { return ResponseHandler.error(res, status, message);}

            
            // Establecer la cookie HttpOnly con el token
            const {tokens, body } = response.body!
            
            if (tokens) {
                const { TOKEN_REFRESH, TOKEN_DEVICE } = tokens

                if (TOKEN_REFRESH) {
                    await generateCookieTokenRefresh(res, TOKEN_REFRESH)
                }

                if (TOKEN_DEVICE) {
                    await generateCookieTokenDevice(res, TOKEN_DEVICE)
                }
            }


            ResponseHandler.success(res, status, message, body);
    
        } catch (err: any) {
            next(err);
        }
    }

    public postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        const { Username, Password } = req.body;

        const _Username = String(Username)
        const _Password = String(Password)
        
        try {
             // Validar que username y password están presentes
            if (!_Username) {
                return ResponseHandler.error(res, 400, 'El nombre de usuario es requerido');
            }
    
            if (!_Password) {
                return ResponseHandler.error(res, 400, 'La contraseña es requerida');
            }

            // Inicializar la variable para saber si se utilizará un token
            const deviceHash = req.cookies?.[actionType.DEVICE];

            const resLogin = await this.login(_Username, _Password, deviceHash);
            if(resLogin.error || !resLogin.body){
                return ResponseHandler.error(res, resLogin.status, resLogin.message )
            }

            const {body, tokens} = resLogin.body        
            if (tokens) {
                const { TOKEN_REFRESH } = tokens
                await generateCookieTokenRefresh(res, TOKEN_REFRESH)  

            }


            return ResponseHandler.success(res, resLogin.status, resLogin.message, body)

            
        } catch (err: any) {
            next(err);
        }       
    }

    public postValidCodeDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{        
        try {
            const { Username, Password, Code } = req.body;

            if (!Code) {
                return ResponseHandler.error(res, 400, 'El código de verificación es requerida');
            }

            if (!Username) {
                return ResponseHandler.error(res, 400, 'El nombre de usuario es requerido');
            }
    
            if (!Password) {
                return ResponseHandler.error(res, 400, 'La contraseña es requerida');
            }

            const _Username = String(Username)
            const _Password = String(Password)
            const _Code = String(Code)

            let deviceInfo: DevicesCreationAttributes | undefined;
            deviceInfo = await this._getDataDevice(req);
            
            const resLogin = await this.validCodeDevice(_Username, _Password, _Code, deviceInfo);

            if(resLogin.error || !resLogin.body){
                return ResponseHandler.error(res, resLogin.status, resLogin.message )
            }

            const {body, tokens} = resLogin.body        
            if (tokens) {
                const { TOKEN_REFRESH, TOKEN_DEVICE } = tokens

                await generateCookieTokenRefresh(res, TOKEN_REFRESH)  

                await generateCookieTokenDevice(res, TOKEN_DEVICE)
                
            }


            return ResponseHandler.success(res, resLogin.status, resLogin.message, body)

            
        } catch (err: any) {
            next(err);
        }       
    }

    private _getDataDevice = async (req: Request): Promise<DevicesCreationAttributes> => {
        const userAgent = req.headers['user-agent'];

        const parser = new UAParser();
        const result = parser.setUA(userAgent).getResult();

        const _ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        return {
            IdAuth: 0,
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

export default new AuthController();