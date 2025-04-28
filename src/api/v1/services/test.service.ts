import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { ServiceResponse } from '../../../common/interfaces/service-response';
import { HistoryRegister } from '../models/history-register';
import { logger } from '../../../core/logger';


export class TokenService {

    protected async listHistoryRegister(): Promise<ServiceResponse<HistoryRegister[]>> {
        try {

            logger.info('listHistoryRegister');
            // logger.info(`📥 POST /register/history - Datos recibidos`);
            // logger.warn(`⚠️ Registro duplicado detectado`);
            // logger.error(`❌ Error al registrar: ${error.message}`);

            const listRecord = await HistoryRegister.findAll();
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'lista de registros',
                body: listRecord
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'listHistoryRegister', 'NewUserService');
        }
    }
}