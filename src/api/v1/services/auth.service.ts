import { Op } from 'sequelize';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { AuthPayload } from '../../../common/interfaces/tokens';
import { ResponseLogin, ResponseDeviceLogin} from '../../../common/interfaces/auth';
import { ServiceResponse } from '../../../common/interfaces/service-response';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { AuthTokens } from '../models/auth-tokens';
import  { Devices, DevicesCreationAttributes } from '../models/devices';
import TokenService from '../../../core/services/tokens/token.service';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { withTransaction } from '../../../common/database/transaction_helper';
import { Transaction } from 'sequelize';
import { Auth } from '../models/auth';
import { Login } from '../models/login';
import { UserPage } from '../models/user-page';
import { StatusAuth } from '../models/status-auth';
import { User } from '../models/user';
import CodeAuthenticationService from './CodeAuthentication.service';
import { generateToken } from '../../../common/utils/authenticationToken';

import { MailActions } from '../../../common/interfaces/mail';
import { prepareAndSendMail } from '../../../common/email/prepareAndSendMail ';
import { CodeAutentication } from '../models/code-autentication';

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

export class AuthService {
    
    protected async logout(): Promise<ServiceResponse<null>> {
        try {
            // Add distinct logout logic or message
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Logout successful. Session terminated.'
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
        }
    }

    protected async loginByHash(dataToken:AuthPayload, Token: string, device:DevicesCreationAttributes): Promise<ServiceResponse<ResponseDeviceLogin>> {
        return await withTransaction(async (transaction)=> {
            try {
                const {body: responseAuth, status, message, error} = await this.validateToken(dataToken, Token, transaction); // 1. Validar Token
                if(error ||  !responseAuth){
                    CriticalError({
                        status,
                        message
                    })
                }

                const {IdUser} = responseAuth               

                const objUserPage = {IdTypePage: 1, IdUser}
                const resUserPage = await UserPage.create(objUserPage, {transaction}) 

                const resDevices = await Devices.create(device, { transaction }); // 2. Crear registro en tabla Device
                
                const TOKEN_DEVICE = uuidv4();
                await resDevices.update({ Token: TOKEN_DEVICE }, { transaction }); // 7. Se genera un hash device y se actualiza en bd

                const resCreateLogin = await this.createLogin({dataAuth: responseAuth, IdDevice: resDevices.IdDevices, IdUserPage:resUserPage.IdUserPage})
                if(resCreateLogin.error){
                    return CriticalError({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Error en el proceso'
                    })
                }

                const resUser = await User.findByPk(IdUser)
                if(!resUser){
                    return CriticalError({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en base de datos'
                    })
                }
                // Mandar correo de bienvenida
                const {Email} = responseAuth
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


                const {TOKEN_ACCESS,TOKEN_REFRESH } = resCreateLogin

                return SuccessResult({
                    status: HttpStatus.OK,
                    message: '¡Inicio de sesión exitoso! Bienvenido.',
                    body: {
                        body:{
                            newDevice: true,
                            firstLogin: true,
                            TOKEN_ACCESS,
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

    protected async login(Username:string, Password:string, hash: string): Promise<ServiceResponse<ResponseLogin>> {
        try {
            const resValidLogin = await this.validParamslogin(Username, Password)
            if(resValidLogin.error){
                return ErrorResult({
                    status: resValidLogin.status,
                    message: resValidLogin.message
                }); 
            }
            
            const {body} = resValidLogin
            const {error, IdDevice} = await this.validateDevice(hash, body!)
            if(error){
                ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Dispositivo no verificado. Por favor, revisa tu correo para continuar con el acceso.'
                })
            }

            const resLogin = await this.loginWithDevice(Username, Password, IdDevice)
            if(resLogin.error){
                ErrorResult({
                    status: resLogin.status,
                    message: resLogin.message
                })
            }

            return SuccessResult({
                status: resLogin.status,
                message: resLogin.message,
                body: resLogin.body
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'logout', 'AuthService');
        }
    }

    protected async validCodeDevice(Username: string, Password: string, Code: string, device:DevicesCreationAttributes): Promise<ServiceResponse<ResponseDeviceLogin>>{
        return await withTransaction(async (transaction)=> {
            try {
    
                const resValidLogin = await this.validParamslogin(Username, Password)
                if(resValidLogin.error || !resValidLogin.body){
                    return ErrorResult({
                        status: resValidLogin.status,
                        message: resValidLogin.message
                    }); 
                }

                const {body:dataAuth} = resValidLogin            
    
                const {IdAuth} = dataAuth
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
                        status: HttpStatus.UNPROCESSABLE_ENTITY,
                        message: 'El código ingresado no es válido o ya ha sido utilizado.',
                    });
                }

                const {IdUser} = dataAuth
                const resUserPage = await UserPage.findOne({
                    where:{ IdUser}
                })
                if(!resUserPage){
                    return ErrorResult({
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error en base de datos'
                    }); 
                }
    
                const resDevices = await Devices.create(device, { transaction }); 
                    
                const TOKEN_DEVICE = uuidv4();
                await resDevices.update({ Token: TOKEN_DEVICE }, { transaction }); 
                const {IdDevices} = resDevices

                const resCreateLogin = await this.createLogin({dataAuth:dataAuth, IdDevice:IdDevices, IdUserPage:resUserPage.IdUserPage})
                if(resCreateLogin.error){
                    return CriticalError({
                        status: HttpStatus.BAD_REQUEST,
                        message: 'Error en el proceso'
                    })
                }
                const {TOKEN_ACCESS,TOKEN_REFRESH } = resCreateLogin

                return SuccessResult({
                    status: HttpStatus.OK,
                    message: `¡Listo! El código es válido, Bienvenido.`,
                    body: {
                        body:{
                            newDevice: true,
                            firstLogin: false,
                            TOKEN_ACCESS
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
    
    private async loginWithDevice(Username:string, Password:string, IdDevice:number):  Promise<ServiceResponse<ResponseLogin>> {
        try {
            
            const dataAuth = await Auth.findOne({ where: { Username } })
            if (!dataAuth) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Usuario o contraseña incorrecta'
                }); 
            }

            const isPasswordValid = await bcrypt.compare(Password, dataAuth.Password);
            if (!isPasswordValid) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Usuario o contraseña incorrecta'
                });
            }

            // Status = 1 activo
            if(dataAuth.Status === 1){    
                // --- Email no verificado se manda correo con el nuevo código
                const IdTypeCode = 1
                await this.sendMailVerificationCode(dataAuth, IdTypeCode, 'Nuevo código de verificación');
                return CriticalError({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Aún no confirma su correo electrónico mediante un código de verificación.'
                })
            }

            if (dataAuth.Status !== 2) {
                //Si el status no es activo (2)
                const status = await StatusAuth.findByPk(dataAuth.Status)
                return ErrorResult({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: `${status?.Description}`
                });
            }

            const {IdUser} = dataAuth
            const resUserPage = await UserPage.findOne({
                where:{ IdUser}
            })
            if(!resUserPage){
                return ErrorResult({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error en base de datos'
                }); 
            }

            const resCreateLogin = await this.createLogin({dataAuth:dataAuth, IdDevice, IdUserPage:resUserPage.IdUserPage})
            if(resCreateLogin.error){
                return CriticalError({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Error en el proceso'
                })
            }
            const {TOKEN_ACCESS,TOKEN_REFRESH } = resCreateLogin

            return SuccessResult({
                status: HttpStatus.OK,
                message: '¡Inicio de sesión exitoso! Bienvenido.',
                body: {
                    body:{
                        newDevice: false,
                        firstLogin: false,
                        TOKEN_ACCESS,
                    },
                    tokens: {
                        TOKEN_REFRESH,
                    }
                },               
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
        }
    }

    private async validParamslogin(Username:string, Password:string): Promise<ServiceResponse<Auth>> {
        try {
            const dataAuth = await this.searchAuth(Username)
            if (!dataAuth) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Usuario o contraseña incorrecta'
                }); 
            }

            const isPasswordValid = await bcrypt.compare(Password, dataAuth.Password);
            if (!isPasswordValid) {
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Usuario o contraseña incorrecta'
                });
            }

            // Status = 1 activo
            if(dataAuth.Status === 1){    
                // --- Email no verificado se manda correo con el nuevo código
                const IdTypeCode = 1
                await this.sendMailVerificationCode(dataAuth, IdTypeCode, 'Nuevo código de verificación');
                return CriticalError({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Aún no confirma su correo electrónico mediante un código de verificación.'
                })
            }

            if (dataAuth.Status !== 2) {
                //Si el status no es activo (2)
                const status = await StatusAuth.findByPk(dataAuth.Status)
                return ErrorResult({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: `${status?.Description}`
                });
            }

            return SuccessResult({
                status: HttpStatus.OK,
                message: `Autorizado`,
                body: dataAuth
            });


        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'validParamslogin', 'AuthService');
        }
        
    }

    private async searchAuth (Username: string):Promise<Auth | null> {
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

    private async createLogin({dataAuth, IdDevice, IdUserPage}: {dataAuth:Auth, IdDevice:number, IdUserPage:number} ): Promise<{error:boolean, TOKEN_ACCESS:string,TOKEN_REFRESH:string }> {
        return await withTransaction(async (transaction)=> {
            try {
   
                const {IdAuth, IdUser} = dataAuth               
                const objLogin = {IdAuth, IdDevice}
                await Login.update({ Active: false }, {
                    where: { IdAuth, IdDevice }
                })

                await Login.create(objLogin, { transaction }); 
                     
                const objTokenefresh = {
                    IdAuth,
                    IdUser, 
                    IdDevice,
                    IdUserPage,
                }
                const resToken = await TokenService.generateRefreshToken(objTokenefresh, transaction)  // 5. Se genera un token Refresh
                if(resToken.error || !resToken.body){
                    return {
                        error: true,
                        TOKEN_ACCESS:'',
                        TOKEN_REFRESH:'' 
                    };
                }

                const { IdRefreshToken, token:tokenRefresh } = resToken.body
                const dataAccessToken = { 
                    IdAuth, 
                    IdUser, 
                    IdUserPage: IdUserPage, 
                    IdRefreshToken
                };

                const resTokenAccess = TokenService.generateTokenAccess(dataAccessToken) // 6. Se genera un token Access
                if(resTokenAccess.error || !resTokenAccess.body){
                    return {
                        error: true,
                        TOKEN_ACCESS:'',
                        TOKEN_REFRESH:'' 
                    };
                }

       
                const {token:tokenAccess} = resTokenAccess.body
                                
                return {
                    error: false,
                    TOKEN_ACCESS:tokenAccess,
                    TOKEN_REFRESH:`Bearer ${tokenRefresh}`  
                };

            } catch (error: any) {
                ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
            }
        })
    }

    private async validateDevice(hash:string, dataAuth:Auth): Promise<{ error: boolean, IdDevice:number }>{
        try {
            //Si existe el registro del dispositivo      

            const device = await Devices.findOne({
                where: { Token: hash, IsActive:true }
            })
            if (!device) {
                //Si no se encuentra, se manda correo con un codigo de validación
                const IdTypeCode = 6
                await this.sendMailVerificationCode(dataAuth, IdTypeCode, 'Seguridad: Verificación del dispositivo');

                return {
                    error: true,
                    IdDevice: 0
                }
            }

            //verificar que este sociado a este dispositivo en DeviceAuth
            // si no asociarlo hacer un insert 
            
            return {
                error: false,
                IdDevice: device.IdDevices
            }     
     
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
        }
    }

    private async sendMailVerificationCode(dataAuth: Auth, IdTypeCode: number, subject:string): Promise<ServiceResponse<{ Token: string }>> {
        try {
            const dataUser = await User.findByPk(dataAuth.IdUser)
            if (!dataUser) {
                throw CriticalError({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'No se encuentra el registro',
                });
            }
    
            const codeAuth = await CodeAuthenticationService.createNewCode({
                IdAuth: dataAuth.IdAuth,
                IdTypeCode
            });

            const {Email} = dataAuth
            const {Name, Firstname, } = dataUser
            // Enviar correo con el código de verificación
            const objEmail = {
                accion: MailActions.CodeAuth,
                to: Email,
                subject: 'Nuevo código de verificación',
                dataMail: {
                    name: Name,
                    firstname: Firstname,
                    code:codeAuth.Code
                }
            }
            await prepareAndSendMail(objEmail)


            const {Token} = generateToken({
                dataToken: {
                    IdAuth: dataAuth.IdAuth,
                    IdUser: dataAuth.IdUser,
                },
                expiresIn: '15m',
            });

            return SuccessResult({
                status: 205,
                message: `Confirma tu correo electrónico, mediante el código de verificación`,
                body: {Token}
            });
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'sendMailVerificationCode', 'AuthService');
        }

    }

    private async validateToken(dataToken:AuthPayload, Token: string, transaction: Transaction): Promise<ServiceResponse<Auth>> {
        try {
            const {body, status, error, message} = await TokenService.validateToken(dataToken)
            if (error || !body) {
                return CriticalError({
                    status,
                    message,
                });
            }
            const {IdAuth, auth} = body
    
            const [updateCount] = await AuthTokens.update({Status: 0},{
                where: {Token, IdAuth, Status: 1},
                transaction
            })
            if(updateCount == 0){
                return CriticalError({
                    status: HttpStatus.UNAUTHORIZED,
                    message: `No autorizado para realizar esta acción`,
                });
            }
    
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Token valido',
                body: auth
            })
            
        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
        }
    }


}