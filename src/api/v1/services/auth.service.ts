import { AuthPayload } from 'src/common/interfaces/auth';
import { ServiceResponse } from 'src/common/interfaces/service-response';
import { SuccessResult, ErrorResult, CriticalError } from 'src/common/utils/response-servece/service-response';
import  { DevicesCreationAttributes } from '../models/devices';

export class AuthService {
    
    protected async loginByHash(hash: string, AuthPayload:AuthPayload, device:DevicesCreationAttributes): 
    Promise<ServiceResponse<{body:{TOKEN_ACCESS:string}, tokens:{TOKEN_DEVICE:string,TOKEN_REFRESH:string}}>> {

        /**
         * * 1. Validar Token (Exista en la bd - Status sea 1  - el IdAuth Del token exista en la bd)
         * * 2. Crear registro en tabla Device 
         * * 3. Crear registro en DeviceAuth  
         * * 4. Crear registro en tabla Login
         * * 5. Crear registro en tabla UserPage
         * * 6. Se genera un token de Refresco se guarda en la bd
         * * 7. Se genera un token de Device se envia por cookie
         * * 7. Se genera un token de Acceso se envia por body 
         */
        //
         

        return SuccessResult({
            status: 200,
            message: '¡Inicio de sesión exitoso! Bienvenido.',
            body: {
                body:{
                    TOKEN_ACCESS: '',
                },
                tokens: {
                    TOKEN_DEVICE: '',
                    TOKEN_REFRESH: `Bearer ${''}`,
                }
            },
            
        });
    }
}