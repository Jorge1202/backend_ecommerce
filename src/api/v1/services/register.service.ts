import { HistoryRegister } from '../models/history-register';

import { User, UserCreationAttributes } from '../models/user';
import { CodeAutentication } from '../models/code-autentication';
import { Auth, AuthCreationAttributes } from '../models/auth';
import { AuthTokens } from '../models/auth-tokens';

import CodeAuthenticationService from './CodeAuthentication.service';

import { MailService } from 'src/common/email';
import { logger } from 'src/core/logger';
import { withTransaction } from 'src/common/database/transaction_helper';
import { HttpStatus } from 'src/common/constants/httpStatus';
import { SuccessResult, ErrorResult, CriticalError } from 'src/common/utils/response-servece/service-response';
import { ErrorHandler } from 'src/common/utils/response-servece/error-handler';
import { generateToken } from 'src/common/utils/auth/authenticationToken';
import { maskEmail } from 'src/common/utils/maskEmail'

import { ServiceResponse } from 'src/common/interfaces/service-response';
import { NewUser } from 'src/common/interfaces/register';
import { AuthPayload } from 'src/common/interfaces/auth';
import { MailServiceConfig, MailActions } from 'src/common/interfaces/mail';
import { TokenService } from './token.service';

const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require('uuid');

// console.log(`🚀 UUID: ${uuidv4()}`); // Genera un nuevo UUID cada vez que se ejecuta el script

interface RegisterResult {
    Token: string;
    maskedEmail: string;
}

export class NewUserService {
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
    protected async updateHistoryRegister(userData: HistoryRegister): Promise<ServiceResponse<number>> {
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
    protected async validEmailRegister(userData: HistoryRegister): Promise<ServiceResponse<HistoryRegister>> {
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
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: responseValid.message
                })
            }

            const createdRecord = await HistoryRegister.create(userData);
            return SuccessResult({
                status: HttpStatus.CREATED,
                message: 'Registro fue creado',
                body: createdRecord
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'createHistoryRegister', 'NewUserService');
        }
    }
    private async verifyEmail(Email: string): Promise<{ error: boolean, message: string }> {
        try {
            // Validar si el email ya existe en la base de datos
            const existingUser = await Auth.findOne({ where: { Email } });
            if (existingUser) {
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

    /**
     * Registra un nuevo usuario en la base de datos y envía un correo de verificación.
     * @param userData - Datos del nuevo usuario.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async newUserRegister(userData: NewUser): Promise<ServiceResponse<RegisterResult>> {
        try {
            return await withTransaction(async (transaction) => {
                const { IdHistoryRegister, Email, Username, Name, Firstname, Lastname, Phone, Password } = userData;

                // Validar Email y Username que no exista
                const existing = await Auth.findOne({ where: { Email }, transaction });
                if (existing) return ErrorResult({ status: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Ya existe un usuario con ese email' });
                const existingUsername = await Auth.findOne({ where: { Username }, transaction });
                if (existingUsername) return ErrorResult({ status: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Ya existe un usuario con ese Username' });

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

                // Crear el registro en la tabla CodeAutentication
                const objDataCode = {
                    IdAuth,
                    IdTypeCode: 1,
                }
                const responseCode = await CodeAuthenticationService.createNewCode(objDataCode, transaction);

                // Crear el registro en la tabla HistoryRegister
                const objHistoryRegister = {
                    Id: IdHistoryRegister,
                    Email,
                    Username,
                    Name,
                    Firstname,
                    Lastname,
                    Phone,
                    StatusRegister: 5,
                    HasPassword: true,
                };
                await HistoryRegister.update(objHistoryRegister, { where: { Id: IdHistoryRegister }, transaction });

                // Enviar correo con el código de verificación
                const mailConfig: MailServiceConfig = {
                    accion: MailActions.CodeAuth,
                    to: Email,
                    subject: 'Código de verificación',
                    dataMail: {
                        name: Name,
                        firstname: Firstname,
                        code: responseCode.Code,
                    }
                };
                await MailService.send(mailConfig);

                // Generar el token de verificación
                const { Token, ExpiresIn } = generateToken({
                    dataToken: {
                        IdAuth
                    },
                    expiresIn: '15m',
                });

                // Guardar el token en la bd
                await AuthTokens.create({
                    Token,
                    IdAuth,
                    TypeTokens: 1,
                    ExpiresIn
                }, { transaction });


                const maskedEmail = maskEmail(Email);

                // Responder al frontend con el token y el email enmascarado
                return SuccessResult({
                    status: HttpStatus.OK,
                    message: 'Usuario registrado correctamente',
                    body: {
                        Token,
                        maskedEmail,
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
            const IdTypeCode = 1;
            const codeValid = await CodeAutentication.findOne({
                where: { IdTypeCode, IdAuth: IdAuth }
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
    protected async verifyCodeEmailRegister(dataToken: AuthPayload, Code: string): Promise<ServiceResponse<{ Hash: string }>> {
        try {
            return await withTransaction(async (transaction) => {

                // 1️⃣ Valida el token de verificación
                const {body, status, error, message} = await TokenService.validateToken(dataToken, transaction)
                if (error || !body) {
                    return ErrorResult({
                        status,
                        message,
                    });
                }
                const {IdAuth, auth} = body

                // 2️⃣ Verificar si el código es correcto y está activo
                const [codeUpdatedCount] = await CodeAutentication.update(
                    { IsActive: false },
                    {   
                        where: { Code, IsActive: true, IdAuth},
                        transaction
                    }
                );
                if (codeUpdatedCount === 0) {
                    return ErrorResult({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        message: 'El código no es válido o ya fue utilizado',
                    });
                }

                // 3️⃣ Si el código es válido, actualizas el estado del usuario a "verificado"
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

                // 4️⃣ Cambias el estado del token a inactivo (ya fue utilizado)
                const [authenticationToken] = await AuthTokens.update(
                    { Status: 0 },
                    {
                        where: {IdAuth},
                        transaction
                    }
                );
                if (authenticationToken === 0) {
                    return ErrorResult({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error de base de datos',
                    });
                }

                // 5️⃣ Generas un nuevo token de acceso (JWT) para iniciar sesión
                const { Token, ExpiresIn } = generateToken({
                    dataToken: {
                        IdAuth,
                    },
                    expiresIn: '15m',
                });

                // 6️⃣ Guardas el nuevo token en la base de datos
                await AuthTokens.create({
                    Token,
                    IdAuth,
                    TypeTokens: 2,
                    ExpiresIn
                }, { transaction });


                return SuccessResult({
                    status: HttpStatus.OK,
                    message: 'Operación exitosa',
                    body: {
                        Hash: Token,
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
    protected async sendCodeAgainRegister(dataToken: AuthPayload): Promise<ServiceResponse<null>> {
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
                    
                //Validar si cuenta con un code estatus 1 (Verificacion de email)
                const IdTypeCode = 1;
                const responseCodeValid = await CodeAutentication.findOne({
                    where: { IdTypeCode, IdAuth },
                    transaction
                });
                if (!responseCodeValid) {
                    return ErrorResult({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        message: 'No cuenta con solicitud de verificacion de correo'
                    });
                }

                await responseCodeValid.update({IsActive:false}, { transaction })

                const objDataCode = {
                    IdAuth,
                    IdTypeCode: 1,
                }
                const responseCode = await CodeAuthenticationService.createNewCode(objDataCode, transaction);
    
    
                const responseUser = await User.findOne({
                    where: { IdUser: auth.IdUser },
                    transaction
                })
                if (!responseUser) {
                    return ErrorResult({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        message: 'No cuenta con solicitud de verificacion de correo'
                    });
                }
    
                // Enviar correo con el código de verificación
                const mailConfig: MailServiceConfig = {
                    accion: MailActions.CodeAuth,
                    to: auth.Email,
                    subject: 'Código de verificación',
                    dataMail: {
                        name: responseUser.Name,
                        firstname: responseUser.Firstname,
                        code: responseCode.Code,
                    }
                };
                await MailService.send(mailConfig);
    
                return SuccessResult({
                    status: HttpStatus.OK,
                    message: 'Vista autorizada'
                });

            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }

    }

}