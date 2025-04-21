import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from 'src/common/interfaces/controller-response';
import { AuthPayload } from 'src/common/interfaces/auth';
import { DevicesCreationAttributes } from '../models/devices';
import { ResponseHandler } from 'src/common/utils/response-controller/response-handler';

import {AuthService} from '../services/auth.service'
const UAParser = require('ua-parser-js');
class AuthController extends AuthService {

    constructor() {
        super();
    }
    
    public loginByHash_Auth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hash = req.headers['authorization']?.split(' ')[1]; 
            const  {dataToken} = req
            const dataTokenAuthUser = dataToken as AuthPayload

            let deviceInfo: DevicesCreationAttributes;
            deviceInfo = await this._getDataDevice(req);
                
            const response = await this.loginByHash(String(hash), dataTokenAuthUser, deviceInfo);
            const { status, message, body, error } = response        
            if (error) { ResponseHandler.error(res, status, message);}

            // Establecer la cookie HttpOnly con el token
            // const {tokens} = body
            // if (tokens) {
            //     const { TOKEN_REFRESH, TOKEN_DEVICE } = tokens

            //     if (TOKEN_REFRESH) {
            //         await generateCookieTokenRefresh(res, TOKEN_REFRESH)
            //     }

            //     if (TOKEN_DEVICE) {
            //         await generateCookieTokenDevice(res, TOKEN_DEVICE)
            //     }
            // }


            ResponseHandler.success(res, status, message, body);
    
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