import { Auth } from '../models/auth';
import { SuccessResult, ErrorResult, CriticalError } from 'src/common/utils/response-servece/service-response';
import { AuthPayload } from 'src/common/interfaces/auth';
import { HttpStatus } from 'src/common/constants/httpStatus';
import { ErrorHandler } from 'src/common/utils/response-servece/error-handler';
import { ServiceResponse } from 'src/common/interfaces/service-response';
import { Transaction } from 'sequelize';


export class TokenService {
    static async validateToken(dataToken: AuthPayload, transaction?:Transaction): Promise<ServiceResponse<{ IdAuth: number, auth: Auth }>> {
        try {
            const { IdAuth, IdUser } = dataToken;
    
            if (!IdAuth) {
                return ErrorResult({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: `Token inválido`
                });
            }
    
            const auth = await Auth.findOne({
                where: { IdAuth },        
            },);
    
            if (!auth) {
                return CriticalError({
                    status: HttpStatus.NOT_FOUND,
                    message: 'No se encontro información'
                });
            }
    
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Token válido',
                body: {
                    IdAuth,
                    IdUser,
                    auth,
                },
            });
    
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }
    }
    
}
