import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { Transaction } from 'sequelize';
import { withTransaction } from '../../Database/transaction_helper';


import { CodeAutentication } from '../models/code-autentication';
import { ServiceResult, successResult, errorResult, throwServerError } from '../../Utils/Response/ServiceResult';
import { MailService, MailServiceConfig, MailActions } from '../../Mails/sendMail';
import { User, UserCreationAttributes } from '../models/user';
import { UserPageService } from './user_page.service'
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { HistoryRegisterService } from './historyRegister.service';
import { CodeAutenticationService } from './code_autentication.service';

import { generateToken } from '../../Secure/tokenJWT';
import { TokenAuthUser } from '../../Secure/interfaceToken';
import { Auth } from '../models/auth';
import { DevicesCreationAttributes } from '../models/devices';
import { LoginService } from './login.service';
import { maskEmail } from '../../Mails/maskEmail';

interface inUser {
    Username: string;
    Name: string;
    Firstname: string;
    Lastname?: string;
    Email: string;
    Phone: string;
    Password: string;
}


interface LoginParams {
    Username: string;
    Password?: string;
    Code?: string;
}
interface CreateRrofileParams {
    Username: Auth;
    Password?: CodeAutentication;
}

export interface ParamsLogin {
    Login: LoginParams
    withToken: boolean;
    deviceToken?: string; // Opcional si ya existe el token del dispositivo
    deviceInfo?: DevicesCreationAttributes; // Opcional si no hay token
}

export class NewUserService {
    protected async _registerUser(user: inUser): Promise<ServiceResult<any>> {
        return await this._registerUser_pv(user)
    }

    private async _registerUser_pv(user: inUser): Promise<any> {
        return await withTransaction(async (transaction) => {
            try {

                const responeValid = await this._validExite(user)
                if (responeValid.code != 200) {
                    throw errorResult({
                        message: responeValid.message,
                        status: responeValid.code,
                    });
                }

                // 1. Crear usuario
                const newUser = await this._createUser({
                    Username: user.Username,
                    Name: user.Name,
                    Firstname: user.Firstname,
                    Lastname: user.Lastname,
                    Email: user.Email,
                    Phone: user.Phone,
                }, transaction);

                if (!newUser) {
                    throw errorResult({
                        message: 'Error al crear el registro',
                        status: 500,
                    });
                }

                // 4. Crear autenticación        
                const authService = new AuthService();
                const resultAuth = await authService.createAuth({
                    IdUser: newUser.IdUser,
                    Username: user.Username,
                    Password: user.Password,
                    Pw: user.Password
                }, transaction);

                if (resultAuth.error) {
                    throw errorResult({
                        message: resultAuth.message,
                        status: resultAuth.status,
                    });
                }

                const { body } = resultAuth
                if (!body || !body.codeAuth) {
                    throw errorResult({
                        message: resultAuth.message,
                        status: resultAuth.status,
                    });
                }

                // Envía el correo
                const mailConfig: MailServiceConfig = {
                    accion: MailActions.CodeAuth,
                    to: user.Email,
                    subject: 'Código de verificación',
                    dataMail: {
                        name: user.Name,
                        firstname: user.Firstname,
                        code: body.codeAuth.Code ?? '',
                    }
                };
                const mailService = new MailService(mailConfig);
                const { send, response } = await mailService.send();
                if (!send) {
                    console.error('mailService.send()', response);
                }

                // 4. Crear autenticación
                const historyRegisterService = new HistoryRegisterService();
                await historyRegisterService.updateByRegister(user, transaction);

                const { auth } = body
                const token = generateToken({
                    dataToken: {
                        IdAuth: auth.IdAuth,
                    },
                    expiresIn: '15m',
                });

                return successResult({
                    status: 201,
                    message: 'Usuario registrado exitosamente. ¡Verifica tu cuenta!',
                    body: {
                        token,
                        maskEmail: maskEmail(user.Email),
                    } 
                });

            } catch (err: any) {
                handleServiceError(err, '_registerUser', 'NewUserService');
            }
        })
    }

    private async _createUser(userData: UserCreationAttributes, transaction: Transaction): Promise<User> {
        try {
            return await User.create(userData, { transaction });
        } catch (err: any) {
            handleServiceError(err, '_createUser', 'NewUserService')
        }
    }

    private async _validExite(user: inUser): Promise<any> {
        try {
            const userExit = await User.findOne({
                where: { Username: user.Username }
            })

            //Hace falta validar si tiene un codigo enviado o si se encuentra en estatus 

            if (userExit) {
                return { message: 'El usuario ya existe', code: 409 }
            }

            const emailExit = await User.findOne({
                where: { Email: user.Email }
            })
            if (emailExit) {
                return { message: 'El email ya existe', code: 409 }
            }

            return { message: 'Los datos son validos', code: 200 }

        }
        catch (err: any) {
            handleServiceError(err, '_validExite', 'NewUserService');
        }
    }

    protected async _validCodeByEmail(dataToken: TokenAuthUser, Code: string): Promise<ServiceResult<any>> {
        try {

            const { IdAuth } = dataToken
            const authData = await Auth.findOne({
                where: { IdAuth }
            })
            if (!authData) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }


            const code_AutService = new CodeAutenticationService();
            const dataCode = await code_AutService.validCode(Code, authData.IdAuth);
            if (dataCode == 0) {
                return errorResult({
                    message: 'El Cóodigo es incorrecto',
                    status: 422,
                });
            }

            const {userData, codeAuth} = await this.__createPageProfile(authData);
            if (!userData || !codeAuth) {
                throw throwServerError({
                    message: 'Error al crear el registro',
                    status: 500,
                });
            }

            return successResult({
                message: 'El Cóodigo generado',
                status: 200,
                body: {
                    Email: userData.Email,
                    Code: codeAuth.Code
                }
            });

        } catch (error: any) {
            handleServiceError(error, '_validCodeByEmail', 'AuthService')
        }
    }

    private async __createPageProfile(authData: Auth): Promise<any> {
        return await withTransaction(async (transaction) => {
            try {
    
                const userData = await User.findOne({
                    where: { IdUser: authData.IdUser }
                })
                if (!userData) {
                    throw throwServerError({
                        message: 'No se encuentra el registro',
                        status: 409,
                    });
                }
    
                authData.Status = 2; //status de auth queda activo=2
                authData.save();
    
                // 2. Crear userPage
                const userPageService = new UserPageService();
                const newUserPage = await userPageService.createUserPage({
                IdTypePage: 1,
                Username: userData.Username,
                IdUser: userData.IdUser,
                }, transaction);       
                
                const infoUserPage = newUserPage.body        
                if (!infoUserPage) {
                    return {
                        message: newUserPage.message,
                        status: newUserPage.status,
                    };
                }
                
                const profileService = new ProfileService();
                await profileService.createProfile({
                Name: userData.Name,
                Firstname: userData.Firstname,
                Lastname: userData.Lastname,
                Email: userData.Email,
                Phone: userData.Phone,
                IdUserPage: infoUserPage.IdUserPage // Relación obligatoria
                }, transaction);
    
                // 6. Crea code para Iniciar sesión  Tipo=5
                const code_AutService = new CodeAutenticationService();
                const codeAuth = await code_AutService.createNewwCode({
                    IdAuth: authData.IdAuth,
                    IdTypeCode: 5
                }, transaction);
    
                return {
                    codeAuth, 
                    userData
                }
    
            } catch (err: any) {
                handleServiceError(err, 'findByPkUser_forAuth', 'NewUserService');
            }
        })
    }

    protected async loginAfterRegister(params: ParamsLogin): Promise<ServiceResult<any>> {
        try {
            const { Login } = params
            const _Login: LoginParams = Login
            const { Username: Email, Code } = _Login; //Cambio de nombre de variables

            const user = await User.findOne({
                where: { Email }
            });
            if (!user) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            const authData = await Auth.findOne({
                where: { IdUser: user.IdUser }
            });
            if (!authData) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            const codeValid = await CodeAutentication.findOne({
                where: { Code, IdAuth: authData.IdAuth }
            });
            if (!codeValid) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            if (!codeValid.IsActive) {
                return errorResult({
                    status: 422,
                    message: 'Tu código ha expirado'
                });
            }

            await codeValid.update({ IsActive: false })

            const modifiedParams: ParamsLogin = {
                ...params,
                Login: {
                    Username: authData.Username,
                    Password: '',
                },
            };

            // Llamar al servicio de login con los datos correspondientes     
            const loginWhithCode = true
            const loginService = new LoginService()
            const responseLogin = await loginService._login(modifiedParams, loginWhithCode);
            return successResult({
                status: 200,
                message: 'Se genero login',
                body: responseLogin
            });

        } catch (err: any) {
            handleServiceError(err, 'loginAfterRegister', 'AuthService');
        }
    }

    protected async _validViewVerifyEmail(dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
        try {

            const { IdAuth } = dataToken
            if (!IdAuth) {
                return errorResult({
                    message: `Token invalido`,
                    status: 400,
                });
            }

            //Validar si cuenta con un code estatus 1
            const IdTypeCode = 1;
            const codeValid = await CodeAutentication.findOne({
                where: { IdTypeCode, IdAuth: IdAuth }
            });
            if (!codeValid) {
                return errorResult({
                    status: 422,
                    message: 'No cuenta con solicitud de verificacion de correo'
                });
            }

            return successResult({
                status: 200,
                message: 'Vista autorizada' //mandar email y email en mask
            });

        } catch (error: any) {
            handleServiceError(error, '_validCodeByEmail', 'AuthService')
        }
    }
    
    protected async _reSendCode(dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
        try {

            const { IdAuth } = dataToken
            if (!IdAuth) {
                return errorResult({
                    message: `Token invalido`,
                    status: 400,
                });
            }

            const auth = await Auth.findOne({
                where: { IdAuth }
            })
            if (!auth) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            const IdTypeCode = 3;
            const code_AutService = new CodeAutenticationService();
            const codeAuth = await code_AutService.createNewwCode({
                IdAuth: IdAuth,
                IdTypeCode
            });

            const user = await User.findOne({
                where: { IdUser: auth.IdUser }
            })
            if (!user) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            // Envía el correo
            const mailConfig: MailServiceConfig = {
                accion: MailActions.CodeAuth,
                to: user.Email,
                subject: 'Código de verificación',
                dataMail: {
                    name: user.Name,
                    firstname: user.Firstname,
                    code: codeAuth.Code ?? '',
                }
            };
            const mailService = new MailService(mailConfig);
            const { send, response: message } = await mailService.send();
            if (!send) {
                console.error('mailService.send()', message);
            }


            return successResult({
                status: 200,
                message: 'Se ha enviado correo con nuevo código'
            });
        } catch (err: any) {
            handleServiceError(err, '_reSendCode', 'AuthService');
        }
    }

}