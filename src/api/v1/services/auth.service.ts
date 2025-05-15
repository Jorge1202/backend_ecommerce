import { Transaction, Op } from 'sequelize';

import { AuthTokens } from '../models/auth-tokens';
import { Devices, DevicesCreationAttributes } from '../models/devices';
import { Auth } from '../models/auth';
import { Login } from '../models/login';
import { UserPage } from '../models/user-page';
import { StatusAuth } from '../models/status-auth';
import { User } from '../models/user';
import { CodeAutentication } from '../models/code-autentication';
import { DeviceAuth, DeviceAuthCreationAttributes } from '../models/device-auth';

import { CodeAuthenticationService } from './CodeAuthentication.service';
import TokenService from '../../../core/services/tokens/token.service';

import { HttpStatus } from '../../../common/constants/httpStatus';
import { AuthPayload } from '../../../common/interfaces/tokens';
import { ResponseLogin, ResponseDeviceLogin, PropsValidLogin, SuccessResponseLogin } from '../../../common/interfaces/auth';
import { ServiceResponse } from '../../../common/interfaces/service-response';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { withTransaction } from '../../../common/database/transaction_helper';
import { MailActions } from '../../../common/interfaces/mail';
import { prepareAndSendMail } from '../../../common/email/prepareAndSendMail ';
import { maskEmail } from '../../../common/utils/maskEmail';
import { RefreshToken } from '../models/refresh-token';


const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');


export class AuthService {

    protected async logout(hashDevice: string, TokenRefresh: string, dataToken: AuthPayload, ): Promise<ServiceResponse<null>> {
        try {
            const responseDevice = await Devices.findOne({
                where:{
                    Token: hashDevice,
                }
            });
            if(!responseDevice){
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Hash no autorizado'
                });
            }


            const { body, status, error, message } = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return CriticalError({
                    status,
                    message,
                });
            }
            const { IdAuth } = body
    
            await Login.update({Active:false}, {
                where: {
                    IdAuth,
                    IdDevice: responseDevice.IdDevice,
                }
            })

            TokenService.revokeRefreshToken(TokenRefresh)            
            await RefreshToken.update({IsActive:false}, {
                where: {
                    IdAuth,
                    IdDevice: responseDevice.IdDevice,
                }
            })

            // Add distinct logout logic or message
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Logout successful. Session terminated.'
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
        }
    }

    protected async loginByHash(dataToken: AuthPayload, Token: string, device: DevicesCreationAttributes): Promise<ServiceResponse<ResponseDeviceLogin>> {
        return await withTransaction(async (transaction) => {
            try {
                const { body: responseAuth, status, message, error } = await this.validateToken(dataToken, Token, transaction); // 1. Validar Token
                if (error || !responseAuth) {
                    CriticalError({
                        status,
                        message
                    })
                }

                const { IdUser, IdAuth } = responseAuth

                const objUserPage = { IdTypePage: 1, IdUser }
                const resUserPage = await UserPage.create(objUserPage, { transaction })

                const resDevices = await Devices.create(device, { transaction }); // 2. Crear registro en tabla Device

                const TOKEN_DEVICE = uuidv4();
                await resDevices.update({ Token: TOKEN_DEVICE }, { transaction }); // 7. Se genera un hash device y se actualiza en bd

                const resCreateLogin = await this.createLogin({ dataAuth: responseAuth, IdDevice: resDevices.IdDevice, IdUserPage: resUserPage.IdUserPage }, transaction)
                if (resCreateLogin.error) {
                    return CriticalError({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Error en el proceso'
                    })
                }

                const resUser = await User.findByPk(IdUser)
                if (!resUser) {
                    return CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en base de datos'
                    })
                }
                // Mandar correo de bienvenida
                const { Email } = responseAuth
                const objEmail = {
                    accion: MailActions.BienvenidoAdmin,
                    to: Email,
                    subject: 'Bienvenido a nuestra comunidad.',
                    dataMail: {
                        name: resUser.Name,
                        firstname: resUser.Firstname,
                    }
                }
                await prepareAndSendMail(objEmail)


                const { TOKEN, TOKEN_REFRESH } = resCreateLogin

                return SuccessResult({
                    status: HttpStatus.OK,
                    message: '¡Inicio de sesión exitoso! Bienvenido.',
                    body: {
                        body: {
                            newDevice: true,
                            firstLogin: true,
                            TOKEN,
                        },
                        tokens: {
                            TOKEN_DEVICE,
                            TOKEN_REFRESH,
                        }
                    },
                });

            } catch (error: any) {
                ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
            }
        })
    }

    protected async login(Username: string, Password: string, hash: string): Promise<ServiceResponse<ResponseLogin>> {
        return await withTransaction(async (transaction) => {
            try {

                //Verifica el status del usuario
                const { error, status, message, Token, dataAuth } = await this.validParamslogin(Username, Password)
                if (error) {
                    return ErrorResult({
                        status: status,
                        message: message
                    });
                }

                if (Token) {
                    //Si el estatus es 1 necesita verificar su correo y se manda Token
                    return SuccessResult({
                        status: HttpStatus.OK,
                        message: 'Aún no has verificado tu correo. Por favor, revisa tu bandeja de entrada para completar el proceso',
                        body: {
                            type: SuccessResponseLogin.LoginSuccess,
                            body: {
                                newDevice: false,
                                firstLogin: true,
                                TOKEN: Token,
                            },
                            tokens: {
                                TOKEN_REFRESH: '',
                            }
                        },
                    });
                }

                if (!dataAuth) {
                    return CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error interno'
                    });
                }


                const { IdAuth, IdUser, Email } = dataAuth

                if (!hash) {
                    //si no existe Hash genvia código por correo para verificar dispositivo
                    const responseNewDevice = await this.newDevice({ IdAuth, IdUser, Email }, transaction)
                    return responseNewDevice
                }


                const { newDevice, IdDevice } = await this.validateDevice(hash, dataAuth)
                if (newDevice) {
                    //valida el hash y si el hash no pertenece al usuario manda código popr correo
                    const responseNewDevice = await this.newDevice({ IdAuth, IdUser, Email }, transaction)
                    return responseNewDevice
                }

                if (!IdDevice) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Dispositivo no identificado'
                    })
                }

                // const resLogin = await this.loginWithDevice(Username, Password, IdDevice)                    
                const resUserPage = await UserPage.findOne({
                    where: { IdUser }
                })
                if (!resUserPage) {
                    return ErrorResult({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en base de datos'
                    });
                }

                const resCreateLogin = await this.createLogin({ dataAuth: dataAuth, IdDevice, IdUserPage: resUserPage.IdUserPage }, transaction)
                if (resCreateLogin.error) {
                    return CriticalError({
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        message: 'Error en el proceso'
                    })
                }
                const { TOKEN, TOKEN_REFRESH } = resCreateLogin

                return SuccessResult({
                    status: HttpStatus.OK,
                    message: '¡Inicio de sesión exitoso! Bienvenido.',
                    body: {
                        type: SuccessResponseLogin.LoginSuccess,
                        body: {
                            newDevice: false,
                            firstLogin: false,
                            TOKEN,
                        },
                        tokens: {
                            TOKEN_REFRESH,
                        }
                    },
                });


            } catch (error: any) {
                ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
            }

        })
    }

    protected async newAccesToken (TokenRefresh: string, dataTokenAccess: AuthPayload, TokenAccess: string): Promise<ServiceResponse<{ TOKEN_ACCESS: string, TOKEN_REFRESH: string }>>{
        try {

            const response = await TokenService.reNewAccessToken(TokenRefresh)
            return response

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
        }
    }


    protected async validCodeDevice(Username: string, Password: string, Code: string, device: DevicesCreationAttributes): Promise<ServiceResponse<ResponseDeviceLogin>> {
        return await withTransaction(async (transaction) => {
            try {

                const responseAuth = await this.searchAuth(Username)
                if (!responseAuth) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Usuario o contraseña incorrecta'
                    });
                }

                const { IdAuth, IdUser, Password:originPass } = responseAuth

                const isPasswordValid = await bcrypt.compare(Password, originPass);
                if (!isPasswordValid) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Usuario o contraseña incorrecta'
                    });
                }

                const [codeUpdatedCount] = await CodeAutentication.update(
                    { IsActive: false },
                    {
                        where: {
                            Code,
                            IdAuth,
                            IsActive: true,
                        },
                        transaction
                    }
                );
                if (codeUpdatedCount === 0) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'El código ingresado no es válido o ya ha sido utilizado.',
                    });
                }

                const resUserPage = await UserPage.findOne({
                    where: { IdUser },
                    transaction
                })
                if (!resUserPage) {
                    return CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en base de datos'
                    });
                }

                const resDevices = await Devices.create({ ...device, IdAuth }, { transaction });

                const TOKEN_DEVICE = uuidv4();
                await resDevices.update({ Token: TOKEN_DEVICE }, { transaction });
                const { IdDevice } = resDevices

                const resCreateLogin = await this.createLogin({ dataAuth: responseAuth, IdDevice, IdUserPage: resUserPage.IdUserPage }, transaction)
                if (resCreateLogin.error) {
                    return CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en el proceso'
                    })
                }
                const { TOKEN, TOKEN_REFRESH } = resCreateLogin


                await AuthTokens.update({ Status: 0 }, {
                    where: { IdAuth, Status: 1, TypeTokens: 4 }
                })

                return SuccessResult({
                    status: HttpStatus.OK,
                    message: `¡Listo! El código es válido, Bienvenido.`,
                    body: {
                        body: {
                            newDevice: true,
                            firstLogin: false,
                            TOKEN
                        },
                        tokens: {
                            TOKEN_DEVICE,
                            TOKEN_REFRESH
                        }
                    },
                });

            } catch (error: any) {
                ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
            }
        })
    }

    protected async verifyToken(dataToken: AuthPayload, Token: string): Promise<ServiceResponse<{ Email: string }>> {
        try {

            const { body, status, error, message } = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return ErrorResult({
                    status,
                    message,
                });
            }
            const { IdAuth, auth } = body

            //Validar si cuenta con un code estatus 1 (Verificacion de email)
            const IdTypeCode = 6;
            const codeValid = await CodeAutentication.findOne({
                where: { IdTypeCode, IdAuth: IdAuth, IsActive: true }
            });
            if (!codeValid) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'No cuenta con solicitud de nuevo dispositivo'
                });
            }

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Vista autorizada',
                body: {
                    Email: maskEmail(auth.Email)
                }
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
        }
    }

    /**
     * Envía nuevamente el código de verificación al correo del usuario.
     * @param dataToken - Datos del token de verificación.
     * @returns Respuesta del servicio con el resultado de la operación.
     */
    protected async sendCodeAgain(dataToken: AuthPayload, tokenOld: string): Promise<ServiceResponse<{ Token: string }>> {
        try {
            return await withTransaction(async (transaction) => {

                const { body, status, error, message } = await TokenService.validateToken(dataToken, transaction)
                if (error || !body) {
                    return ErrorResult({
                        status,
                        message,
                    });
                }
                const { IdAuth, auth } = body

                // Cambia el status del token a 0
                await AuthTokens.update({ Status: 0 }, {
                    where: { Token: tokenOld, IdAuth, Status: 1, TypeTokens: 1 },
                    transaction
                })

                //Validar si cuenta con un code estatus 
                const IdTypeCode = 6;
                const responseCodeValid = await CodeAutentication.findOne({
                    where: { IdTypeCode, IdAuth, IsActive: true },
                    transaction
                });
                if (!responseCodeValid) {
                    return ErrorResult({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'No cuenta con solicitud de verificacion de dispositivo'
                    });
                }

                await responseCodeValid.update({ IsActive: false }, { transaction })


                const responseUser = await User.findOne({
                    where: { IdUser: auth.IdUser },
                    transaction
                })
                if (!responseUser) {
                    return CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en la base de datos'
                    });
                }

                const { IdUser, Name, Firstname } = responseUser
                const Token = await CodeAuthenticationService.SendVerificationDevice({
                    IdAuth, IdUser, Name, Firstname, Email: auth.Email,
                }, transaction)             

                return SuccessResult({
                    status: HttpStatus.OK,
                    message: 'Nuevo código enviado'
                });

            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }

    }


    private async newDevice({ IdUser, IdAuth, Email }: { IdUser: string, IdAuth: number, Email: string }, transaction: Transaction): Promise<ServiceResponse<ResponseLogin>> {
        try {
            const dataUser = await User.findByPk(IdUser)
            if (!dataUser) {
                return CriticalError({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error interno'
                });
            }
            const { Name, Firstname } = dataUser

            const Token = await CodeAuthenticationService.SendVerificationDevice({
                IdAuth, IdUser, Email, Name, Firstname
            }, transaction)
            if (!Token) {
                return CriticalError({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error interno'
                });
            }


            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Nuevo dispositivo, Por favor, revisa tu bandeja de entrada para completar el proceso',
                body: {
                    type: SuccessResponseLogin.LoginSuccess,
                    body: {
                        newDevice: true,
                        firstLogin: false,
                        TOKEN: Token,
                    },
                    tokens: {
                        TOKEN_REFRESH: '',
                    }
                },
            });
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
        }
    }

    private async validParamslogin(Username: string, Password: string): Promise<PropsValidLogin<Auth>> {
        try {
            const responseAuth = await this.searchAuth(Username)
            if (!responseAuth) {
                return {
                    error: true,
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Usuario o contraseña incorrecta'
                };
            }

            const { IdAuth, IdUser, Email, Status, Password: pwOrigin } = responseAuth

            const isPasswordValid = await bcrypt.compare(Password, pwOrigin);
            if (!isPasswordValid) {
                return {
                    error: true,
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Usuario o contraseña incorrecta'
                };
            }

            if (Status !== 1 && Status !== 2) {
                const status = await StatusAuth.findByPk(Status)
                return {
                    error: true,
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: `${status?.Description}`
                };
            }

            const dataUser = await User.findByPk(IdUser)
            if (!dataUser) {
                return {
                    error: true,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: `Error de base de datos`
                };
            }

            const { Name, Firstname } = dataUser

            if (Status === 1) {
                const Token = await CodeAuthenticationService.SendVerificationEmail({
                    IdAuth, IdUser, Email, Name, Firstname
                })
                return {
                    error: false,
                    status: HttpStatus.BAD_REQUEST,
                    message: `Verifica tu correo`,
                    Token
                };
            }

            return {
                error: false,
                status: HttpStatus.OK,
                message: `Autorizado`,
                dataAuth: responseAuth,
            };

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'validParamslogin', 'AuthService');
        }

    }

    private async searchAuth(Username: string): Promise<Auth | null> {
        try {
            const dataAuth = await Auth.findOne({
                where: {
                    [Op.or]: [
                        { Username },
                        { Email: Username }
                    ]
                }
            })
            return dataAuth
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'validParamslogin', 'AuthService');
        }
    }

    private async createLogin({ dataAuth, IdDevice, IdUserPage }: { dataAuth: Auth, IdDevice: number, IdUserPage: number }, transaction: Transaction): Promise<{ error: boolean, TOKEN: string, TOKEN_REFRESH: string }> {
        try {

            const { IdAuth, IdUser } = dataAuth
            await Login.update({ Active: false }, {
                where: { IdAuth, IdDevice, Active: true },
                transaction
            })

            await Login.create({ IdAuth, IdDevice }, { transaction });

            const objTokenefresh = {
                IdAuth,
                IdUser,
                IdDevice,
                IdUserPage,
            }
            const resToken = await TokenService.generateRefreshToken(objTokenefresh, transaction)  // 5. Se genera un token Refresh
            if (resToken.error || !resToken.body) {
                return {
                    error: true,
                    TOKEN: '',
                    TOKEN_REFRESH: ''
                };
            }

            const { IdRefreshToken, token: tokenRefresh } = resToken.body
            const dataAccessToken = {
                IdAuth,
                IdUser,
                IdUserPage: IdUserPage,
                IdRefreshToken
            };

            const resTokenAccess = TokenService.generateTokenAccess(dataAccessToken) // 6. Se genera un token Access
            if (resTokenAccess.error || !resTokenAccess.body) {
                return {
                    error: true,
                    TOKEN: '',
                    TOKEN_REFRESH: ''
                };
            }


            const { token: tokenAccess } = resTokenAccess.body

            return {
                error: false,
                TOKEN: tokenAccess,
                TOKEN_REFRESH: tokenRefresh
            };

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
        }
    }

    private async validateDevice(hash: string, dataAuth: Auth): Promise<{ IdDevice: number | null, newDevice: boolean }> {
        try {
            let newDevice = false

            const device = await Devices.findOne({ where: { Token: hash, IsActive: true } })
            if (!device) {
                newDevice = true
                return {
                    IdDevice: null,
                    newDevice
                }
            }

            // Si el dispositivo existe pero pertenece a otro usuario
            if (device.IdAuth !== dataAuth.IdAuth) {
                newDevice = true
                const alreadyLinked = await DeviceAuth.findOne({
                    where: { IdDevice: device.IdDevice, IdAuth: dataAuth.IdAuth },
                });

                if (!alreadyLinked) {
                    const newAuth: DeviceAuthCreationAttributes = {                        
                        IdDevice: device.IdDevice,
                        IdAuth: dataAuth.IdAuth,
                    };
                    await DeviceAuth.create(newAuth);
                }
            }

            return {
                IdDevice: device.IdDevice,
                newDevice
            };
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'validateDevice', 'AuthService');
        }
    }

    private async validateToken(dataToken: AuthPayload, Token: string, transaction: Transaction): Promise<ServiceResponse<Auth>> {
        try {
            const { body, status, error, message } = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return CriticalError({
                    status,
                    message,
                });
            }
            const { IdAuth, auth } = body

            const [updateCount] = await AuthTokens.update({ Status: 0 }, {
                where: { Token, IdAuth, Status: 1, TypeTokens: 2 },
                transaction
            })
            if (updateCount == 0) {
                return CriticalError({
                    status: HttpStatus.UNAUTHORIZED,
                    message: `No autorizado para realizar esta acción`,
                });
            }

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Vista autorizada',
                body: auth
            })

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
        }
    }

}