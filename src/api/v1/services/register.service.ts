import { HistoryRegister, HistoryRegisterCreationAttributes } from '../models/history-register';

import { User, UserCreationAttributes } from '../models/user';
import { CodeAutentication } from '../models/code-autentication';
import { Auth, AuthCreationAttributes } from '../models/auth';
import { AuthTokens } from '../models/auth-tokens';

import {CodeAuthenticationService} from './CodeAuthentication.service';

import { withTransaction } from '../../../common/database/transaction_helper';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { generateToken } from '../../../common/utils/authenticationToken';
import { maskEmail } from '../../../common/utils/maskEmail'

import { ServiceResponse } from '../../../common/interfaces/service-response';
import { NewUser, RegisterResult } from '../../../common/interfaces/register';
import { AuthPayload } from '../../../common/interfaces/tokens';
import TokenService from '../../../core/services/tokens/token.service';

const bcrypt = require("bcrypt");

export class NewUserService {
    protected async updateHistoryRegister(userData: HistoryRegisterCreationAttributes): Promise<ServiceResponse<number>> {
        try {

            const [affectedCount] = await HistoryRegister.update(userData,
                {
                    where: { Id: userData.Id }
                });

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Registro fue actualizado',
                body: affectedCount
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'updateHistoryRegister', 'NewUserService');
        }
    }

    /**
     * Valida el email y crea un nuevo registro de usuario en la base de datos.
     * @param userData - Datos del nuevo usuario.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async validEmailRegister(userData: HistoryRegister, idHistory:null|number): Promise<ServiceResponse<HistoryRegister>> {
        try {

            if (!userData.Email) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El campo Email es requerido'
                })
            }
        
            const responseValid = await this.verifyEmail(userData.Email);
            if (responseValid.error) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: responseValid.message
                })
            }

            if (!idHistory) {
                const createdRecord = await HistoryRegister.create(userData);
                return SuccessResult({
                    status: HttpStatus.OK,
                    message:  responseValid.message,
                    body: createdRecord
                });
            }

            await HistoryRegister.update({Email:userData.Email}, {
                where:{Id: idHistory}
            });

            return SuccessResult({
                status: HttpStatus.OK,
                message:  responseValid.message,
            });


            
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'createHistoryRegister', 'NewUserService');
        }
    }
    private async verifyEmail(Email: string): Promise<{ error: boolean, message: string }> {
        try {
            // Validar si el email ya existe en la base de datos
            const existingUser = await Auth.findOne({ where: { Email } });
            if (!!existingUser) {
                return {
                    error: true,
                    message: 'El corrreo proporcionado no esta disponible',
                };
            }

            return {
                error: false,
                message: 'El corrreo proporcionado esta disponible',
            };


        } catch (error) {
            ErrorHandler.handleServiceError(error, 'verifyEmail', 'NewUserService');
        }

    }

    public async verifyUsername(Username: string, IdHistoryRegister:number): Promise<ServiceResponse<HistoryRegister>> {
        try {
            // Validar si el email ya existe en la base de datos
            const existingUser = await Auth.findOne({ where: { Username } });
            if (existingUser) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'El Username proporcionado no esta disponible',
                })
            }

            const objHistory = {
                Id: IdHistoryRegister,
                Username: Username,
                StatusRegister: 3,
                DateUpdate: new Date()
            }
            this.updateHistoryRegister(objHistory)

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'El Username proporcionado esta disponible',
            })

        } catch (error) {
            ErrorHandler.handleServiceError(error, 'verifyEmail', 'NewUserService');
        }
    }

    /**
     * Registra un nuevo usuario en la base de datos y envía un correo de verificación.
     * @param userData - Datos del nuevo usuario.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async newUserRegister(userData: NewUser): Promise<ServiceResponse<RegisterResult>> {
        try {
            return await withTransaction(async (transaction) => {
                const { IdHistoryRegister, Email, Password, Username, Name, Firstname, Lastname, Phone,  } = userData;

                // Validar Email y Username que no exista
                const existing = await Auth.findOne({ where: { Email }, transaction });
                if (existing) return ErrorResult({ status: HttpStatus.BAD_REQUEST, message: 'Ya existe un usuario con ese email' });


                const existingUsername = await Auth.findOne({ where: { Username }, transaction });
                if (existingUsername) return ErrorResult({ status: HttpStatus.BAD_REQUEST, message: 'Ya existe un usuario con ese Username' });

                // Crear el registro en la tabla User
                const objDataUser: UserCreationAttributes = {
                    Username,
                    Name,
                    Firstname,
                    Lastname,
                    Email,
                    Phone,
                }
                const { IdUser } = await User.create(objDataUser, { transaction });

                // Crear el registro en la tabla Auth
                // Hashear la contraseña
                const hashedPassword = await bcrypt.hash(Password, 10);
                const objDataAuth: AuthCreationAttributes = {
                    IdUser,
                    Email,
                    Username: Username,
                    Password: hashedPassword,
                    Pw: Password
                }
                const { IdAuth } = await Auth.create(objDataAuth, { transaction });



                const Token = await CodeAuthenticationService.SendVerificationEmail({   
                        IdAuth, IdUser, Email, Name, Firstname,
                    }, 
                    transaction)
                if(!Token){
                    return ErrorResult({
                        status:HttpStatus.INTERNAL_SERVER_ERROR,
                        message:'Error interno'
                    })
                }

                // Crear el registro en la tabla HistoryRegister
                const objHistoryRegister = {
                    Id: IdHistoryRegister,
                    IdUser,
                    Email,
                    Username,
                    Name,
                    Firstname,
                    Lastname,
                    Phone,
                    StatusRegister: 6,
                    HasPassword: true,
                };
                await HistoryRegister.update(objHistoryRegister, { where: { Id: IdHistoryRegister }, transaction });

       
                

                // Responder al frontend con el token y el email enmascarado
                return SuccessResult({
                    status: HttpStatus.CREATED,
                    message: 'Usuario registrado correctamente',
                    body: {
                        Token,
                        maskedEmail:maskEmail(Email),
                    }
                });
            });
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'registerUser', 'NewUserService');
        }
    }

    /**
     * Verifica el acceso a la vista por medio del token.
     * @param dataToken - Datos del token de verificación.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async verifyTokenRegister(dataToken: AuthPayload, Token: string): Promise<ServiceResponse<null>> {
        try {
            const {body, status, error, message} = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return ErrorResult({
                    status,
                    message,
                });
            }
            const {IdAuth} = body
            

            // const [updateCount] = await AuthTokens.update({Status: 0},{
            //     where: {Token, IdAuth, Status: 1, TypeTokens: 1}
            // })
            // if(updateCount == 0){
            //     return ErrorResult({
            //         status: HttpStatus.BAD_REQUEST,
            //         message: `Token invalido`,
            //     });
            // }

            //Validar si cuenta con un code estatus 1 (Verificacion de email)
            const IdTypeCode = 1;
            const codeValid = await CodeAutentication.findOne({
                where: { IdTypeCode, IdAuth: IdAuth, IsActive:true }
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
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }

    }

    /**
     * Verifica el código enviado al correo del usuario.
     * @param dataToken - Datos del token de verificación.
     * @param Code - Código de verificación.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async verifyCodeEmailRegister(dataToken: AuthPayload, Code: string, Token:string): Promise<ServiceResponse<{ Hash: string }>> {
        try {
            return await withTransaction(async (transaction) => {

                // Valida el token de verificación
                const {body, status, error, message} = await TokenService.validateToken(dataToken, transaction)
                if (error || !body) {
                    return ErrorResult({
                        status,
                        message,
                    });
                }
                const {IdAuth, auth} = body

                // Se actualiza los tokens en status 0 y en TypeTokens: 1
                await AuthTokens.update({Status: 0},{
                    where: {IdAuth, Status: 1, TypeTokens: 1},
                    transaction
                })
             

                // Verificar si el código es correcto y está activo
                const [codeUpdatedCount] = await CodeAutentication.update(
                    { IsActive: false },
                    {   
                        where: { Code, IsActive: true, IdAuth},
                        transaction
                    }
                );
                if (codeUpdatedCount === 0) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'El código no es válido o ya fue utilizado',
                    });
                }

                // Si el código es válido, actualizas el estado del usuario a "verificado"
                const [authUpdatedCount] = await Auth.update({ Status: 2 }, 
                    {    
                        where: { IdAuth, },
                        transaction
                    }
                );
                if (authUpdatedCount === 0) {
                    return ErrorResult({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error de base de datos',
                    });
                }

                

                // Generas un nuevo token de acceso (JWT) para iniciar sesión
                const { Token:tokenAccess, ExpiresIn } = generateToken({
                    dataToken: {
                        IdAuth,
                        IdUser:auth.IdUser
                    },
                    expiresIn: '15m',
                });

                // Guardas el nuevo token de tipo 2 (Login)
                await AuthTokens.create({
                    Token:tokenAccess,
                    IdAuth,
                    TypeTokens: 2,
                    ExpiresIn
                }, { transaction });


                const resHistory = await HistoryRegister.findOne({
                    where: { IdUser: auth.IdUser },
                    transaction 
                });
                if(resHistory){
                    await resHistory.update({                                                
                        StatusRegister: 7,
                    }, { transaction })
                }


                return SuccessResult({
                    status: HttpStatus.OK,
                    message: '¡Código válido!, procede a inicia sesión',
                    body: {
                        Hash: tokenAccess,
                    }
                });
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }
    }

    /**
     * Envía nuevamente el código de verificación al correo del usuario.
     * @param dataToken - Datos del token de verificación.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async sendCodeAgainRegister(dataToken: AuthPayload, tokenOld:string): Promise<ServiceResponse<{Token:string}>> {
        try {
            return await withTransaction(async (transaction) => {

                const {body, status, error, message} = await TokenService.validateToken(dataToken, transaction)
                if (error || !body) {
                    return ErrorResult({
                        status,
                        message,
                    });
                }
                const {IdAuth, auth} = body

                // Cambia el status del token a 0
                await AuthTokens.update({Status: 0},{
                    where: {Token:tokenOld, IdAuth, Status: 1, TypeTokens: 1}
                })
                    
                //Validar si cuenta con un code estatus 1 (Verificacion de email)
                const IdTypeCode = 1;
                const responseCodeValid = await CodeAutentication.findOne({
                    where: { IdTypeCode, IdAuth, IsActive:true },
                    transaction
                });
                if (!responseCodeValid) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'No cuenta con solicitud de verificacion de correo'
                    });
                }

                await responseCodeValid.update({IsActive:false}, { transaction })


                const responseUser = await User.findOne({
                    where: { IdUser: auth.IdUser },
                    transaction
                })
                if (!responseUser) {
                    return ErrorResult({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en la base de datos'
                    });
                }

                const {IdUser,Name,Firstname} = responseUser
                const Token = await CodeAuthenticationService.SendVerificationEmail({
                    IdAuth,IdUser, Name, Firstname, Email: auth.Email,
                }, transaction)
                if(!Token){
                    return ErrorResult({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error Interno'
                    });
                }
    
                return SuccessResult({
                    status: HttpStatus.OK,
                    message: 'Nuevo código enviado',
                    body: {
                        Token
                    }
                });

            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }

    }

}