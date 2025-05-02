import { Transaction, Op } from 'sequelize';

import { AuthTokens } from '../models/auth-tokens';
import  { Devices, DevicesCreationAttributes } from '../models/devices';
import { Auth } from '../models/auth';
import { Login } from '../models/login';
import { UserPage } from '../models/user-page';
import { StatusAuth } from '../models/status-auth';
import { User } from '../models/user';
import { CodeAutentication } from '../models/code-autentication';
import { DeviceAuth, DeviceAuthAttributes } from '../models/device-auth';

import CodeAuthenticationService from './CodeAuthentication.service';
import TokenService from '../../../core/services/tokens/token.service';

import { HttpStatus } from '../../../common/constants/httpStatus';
import { AuthPayload } from '../../../common/interfaces/tokens';
import { ResponseLogin, ResponseDeviceLogin} from '../../../common/interfaces/auth';
import { ServiceResponse } from '../../../common/interfaces/service-response';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { withTransaction } from '../../../common/database/transaction_helper';
import { generateToken } from '../../../common/utils/authenticationToken';
import { MailActions } from '../../../common/interfaces/mail';
import { prepareAndSendMail } from '../../../common/email/prepareAndSendMail ';
import { SuccessResponseLogin } from '../../../common/interfaces/auth';


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

                const {IdUser, IdAuth} = responseAuth               

                const objUserPage = {IdTypePage: 1, IdUser}
                const resUserPage = await UserPage.create(objUserPage, {transaction}) 

                const resDevices = await Devices.create(device, { transaction }); // 2. Crear registro en tabla Device
                
                const TOKEN_DEVICE = uuidv4();
                await resDevices.update({ Token: TOKEN_DEVICE }, { transaction }); // 7. Se genera un hash device y se actualiza en bd

                const resCreateLogin = await this.createLogin({dataAuth: responseAuth, IdDevice: resDevices.IdDevice, IdUserPage:resUserPage.IdUserPage}, transaction)
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
            
            if(!hash && body){
                const mailDevice = await this.sendVerificationCodeResponse(body);            
                return ErrorResult( {
                    status: mailDevice.status,
                    message: mailDevice.message,
                })                            
            }


            const {error, body:infoDevice} = await this.validateDevice(hash, body!)
            if(error || !infoDevice){
                return ErrorResult({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Dispositivo no verificado'
                })
            }

            const resLogin = await this.loginWithDevice(Username, Password, infoDevice.IdDevice)
            if(resLogin.error){
                return ErrorResult({
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
                    where:{ IdUser},
                    transaction
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
                const {IdDevice} = resDevices

                const resCreateLogin = await this.createLogin({dataAuth:dataAuth, IdDevice, IdUserPage:resUserPage.IdUserPage}, transaction)
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
        return await withTransaction(async (transaction)=> {

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
    
                const resCreateLogin = await this.createLogin({dataAuth:dataAuth, IdDevice, IdUserPage:resUserPage.IdUserPage}, transaction)
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
                        type: SuccessResponseLogin.LoginSuccess,
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
        })
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

    private async createLogin({dataAuth, IdDevice, IdUserPage}: {dataAuth:Auth, IdDevice:number, IdUserPage:number}, transaction:Transaction ): Promise<{error:boolean, TOKEN_ACCESS:string,TOKEN_REFRESH:string }> {        
        try {

            const {IdAuth, IdUser} = dataAuth               
            await Login.update({ Active: false }, {
                where: { IdAuth, IdDevice, Active: true },
                transaction
            })
            
            await Login.create({IdAuth, IdDevice}, { transaction }); 
                    
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
                TOKEN_ACCESS: tokenAccess,
                TOKEN_REFRESH: tokenRefresh  
            };

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'loginByHash', 'AuthService');
            }
    }

    private async validateDevice( hash: string, dataAuth: Auth): Promise<ServiceResponse<{ IdDevice: number }>> {
        try {

          
          const device = await Devices.findOne({ where: { Token: hash, IsActive: true } })
          if (!device) {
            return ErrorResult({
                status: HttpStatus.BAD_REQUEST,
                message:'Identificador de dispositivo incorrecto'
            })
          }
      
          // Si el dispositivo existe pero pertenece a otro usuario
          if (device.IdAuth !== dataAuth.IdAuth) {
            const alreadyLinked = await DeviceAuth.findOne({
              where: { IdDevice: device.IdDevice, IdAuth: dataAuth.IdAuth },
            });
      
            if (!alreadyLinked) {
              const newAuth: DeviceAuthAttributes = {
                IdDeviceAuth: 0,
                IdDevice: device.IdDevice,
                IdAuth: dataAuth.IdAuth,
              };
              await DeviceAuth.create(newAuth);
            }
          }
      
          return SuccessResult({
            status: HttpStatus.OK,
            message: 'Dispositivo validado',
            body: {
              IdDevice: device.IdDevice,
            },
          });
        } catch (error: any) {
          ErrorHandler.handleServiceError(error, 'validateDevice', 'AuthService');
        }
      }
      

    private async sendVerificationCodeResponse(dataAuth: Auth): Promise<ServiceResponse<null>> {
        const IdTypeCode = 6;
        const mailDevice = await this.sendMailVerificationCode(dataAuth, IdTypeCode, 'Seguridad: Verificación de dispositivo');
      
        const {message } = mailDevice;
        return ErrorResult({
          status: HttpStatus.BAD_REQUEST,
          message: message,
        });
      
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
                IdTypeCode,
                Description:subject
            });

            const {Email} = dataAuth
            const {Name, Firstname, } = dataUser
            // Enviar correo con el código de verificación
            const objEmail = {
                accion: MailActions.NuevoDispositivo,
                to: Email,
                subject: 'Seguridad: Verificación de nuevo dispositivo',
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
                status: HttpStatus.OK,
                message: `Por seguridad, te hemos enviado un código a tu correo. Por favor, verifica este acceso para continuar`,
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
                where: {Token, IdAuth, Status: 1, TypeTokens:2},
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