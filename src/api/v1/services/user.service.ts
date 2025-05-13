import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { ServiceResponse } from '../../../common/interfaces/service-response';



export class UserService {
    protected async header(): Promise<ServiceResponse<null>>{
        try {

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'lista de registros',            
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'listHistoryRegister', 'NewUserService');
        }
    }

    protected async profile(): Promise<ServiceResponse<null>>{
        try {
            
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'lista de registros',            
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'listHistoryRegister', 'NewUserService');
        }
    }



    
}