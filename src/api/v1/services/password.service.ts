
import { Auth } from '../models/auth';
import { AuthTokens } from '../models/auth-tokens';
import { User } from '../models/user';
import { CodeAutentication } from '../models/code-autentication';

import CodeAuthenticationService from './CodeAuthentication.service';

import { withTransaction } from '../../../common/database/transaction_helper';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { ServiceResponse } from '../../../common/interfaces/service-response';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { generateToken } from '../../../common/utils/authenticationToken';
import { MailService } from '../../../common/email';
import { MailServiceConfig, MailActions } from '../../../common/interfaces/mail';
import { AuthPayload } from '../../../common/interfaces/tokens';

import TokenService from '../../../core/services/tokens/token.service';
import { prepareAndSendMail } from '../../../common/email/prepareAndSendMail ';

import { logger } from '../../../core/logger';
const bcrypt = require("bcrypt");

export class PasswordService {
    protected async recovery(Email:string): Promise<ServiceResponse<{Token:string}>> {
        try {
            return await withTransaction(async (transaction) => {
                const auth = await Auth.findOne({
                    where: {Email}
                })
                if(!auth){
                    return ErrorResult({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        message:'Si existe una cuenta asociada con este correo, recibirás un email',
                    })
                }

                
                const responseCode = await CodeAuthenticationService.createNewCode({
                    IdAuth:auth.IdAuth,
                    IdTypeCode: 3,
                    Description:'Solicitud de recordar contraseña'
                },transaction)
                
                const {Token, ExpiresIn} = generateToken({
                    dataToken: {
                        IdAuth: auth.IdAuth,
                        IdUser:auth.IdUser
                    },
                    expiresIn: '30m',
                });

                await AuthTokens.create({
                    Token,
                    IdAuth:auth.IdAuth,
                    TypeTokens: 3,
                    ExpiresIn
                }, { transaction });


                const user = await User.findOne({
                    where: {IdUser: auth.IdUser}
                })
                if(!user){
                    CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en base de datos'
                    })
                }

                const objEmail = {
                    accion: MailActions.RecoveryPassword,
                    to: Email,
                    subject: 'Solicitud de cambio de contraseña',
                    dataMail: {
                        name: user.Name,
                        firstname: user.Firstname,
                        token:Token,
                        code:responseCode.Code
                    }
                }
                await prepareAndSendMail(objEmail)

                
                return SuccessResult({
                    status: HttpStatus.OK,
                    message: `¡Solicitud aprovada!, Accede al correo (${Email}) para seguir el proceso`,
                    body: {Token}
                })
            })
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'recovery', 'PasswordService');
        }
    }
    protected async verifyToken(dataToken: AuthPayload, Token: string): Promise<ServiceResponse<null>>{
        try {
            
            const {body, status, error, message} = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return ErrorResult({
                    status,
                    message,
                });
            }
            const {IdAuth, auth} = body

            const [updateCount] = await AuthTokens.update({Status: 0},{
                where: {Token, IdAuth, Status: 1}
            })
            if(updateCount == 0){
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: `Token invalido`,
                });
            }

            //Validar si cuenta con un code estatus 1 (Verificacion de email)
            const IdTypeCode = 3;
            const codeValid = await CodeAutentication.findOne({
                where: { IdTypeCode, IdAuth }
            });
            if (!codeValid) {
                return ErrorResult({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'No cuenta con solicitud de verificacion de correo'
                });
            }

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Vista autorizada'
            });        

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyToken', 'PasswordService');
        }
    }
    protected async validCode(dataToken: AuthPayload, Code:string):Promise<ServiceResponse<null>>{
        try {

            const {body, status, error, message} = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return ErrorResult({
                    status,
                    message,
                });
            }
            const {IdAuth, auth} = body
            
            const [codeUpdatedCount] = await CodeAutentication.update(
                { IsActive: false },
                {
                    where: {
                        Code,
                        IdAuth,
                        IsActive: true,
                    }
                }
            );
            if (codeUpdatedCount === 0) {
                return ErrorResult({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'El código no es válido o ya fue utilizado',
                });
            }

            return SuccessResult({
                status: HttpStatus.OK,
                message: `¡Código correcto! Puedes cambiar tu contraseña`
            });         

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'validCode', 'PasswordService');
        }
    } 
    protected async changePassword(dataToken:AuthPayload, Password: string):Promise<ServiceResponse<null>>{
        try {

            const {body, status, error, message} = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return ErrorResult({
                    status,
                    message,
                });
            }
            const {IdAuth, auth} = body
            

            const hashedPassword = await bcrypt.hash(Password, 10);
            auth.Password = hashedPassword
            auth.Pw = Password
            await auth.save()


            const user = await User.findOne(
                { where: {IdUser: auth.IdUser}}
            )
            if(!user){
                return CriticalError({
                    status: HttpStatus.NOT_FOUND,
                    message: 'No existe usuario'
                })
            }

            const objEmail = {
                accion: MailActions.PasswordChangeSuccessful,
                to: auth.Email,
                subject: 'Confirmación de cambio de contraseña',
                dataMail: {
                    name: user.Name,
                    firstname: user.Firstname,
                }
            }
            await prepareAndSendMail(objEmail)


            return SuccessResult({
                status: HttpStatus.OK,
                message: '¡Contraseña actualizada! Ahora inicia sesión con tu nueva contraseña'
            });         

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'validCode', 'PasswordService');
        }

    }
    protected async newCode(dataToken:AuthPayload, Token: string):Promise<ServiceResponse<null>>{
        try {
            const {body, status, error, message} = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return ErrorResult({
                    status,
                    message,
                });     
            }
            const {IdAuth, auth} = body


            /**Valida el estatus del usuario que este en estatus  */


            
            const responseCode = await CodeAuthenticationService.createNewCode({
                IdAuth,
                IdTypeCode: 3,
                Description:'Reenviar codigo de recordar contraseña'
            })
            

            const user = await User.findOne({
                where: {IdUser: auth.IdUser}
            })
            if(!user){
                CriticalError({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error en base de datos'
                })
            }

            const objEmail = {
                accion: MailActions.RecoveryPassword,
                to: auth.Email,
                subject: 'Solicitud de cambio de contraseña',
                dataMail: {
                    name: user.Name,
                    firstname: user.Firstname,
                    token:Token,
                    code: responseCode.Code,
                }
            }
            await prepareAndSendMail(objEmail)
            
            return SuccessResult({
                status: HttpStatus.OK,
                message: `Código enviado`,
            })


        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'newCode', 'PasswordService');
        }
    }
}
