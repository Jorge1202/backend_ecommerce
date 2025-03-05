import { Transaction, where } from 'sequelize';
import { handleServiceError } from '../../Utils/Response/handleServiceError';
import { ServiceResult, successResult, errorResult, throwServerError } from '../../Utils/Response/ServiceResult';
import { MailService, MailServiceConfig, MailActions } from '../../Mails/sendMail';
import { Devices, DevicesCreationAttributes } from '../models/devices';
import { withTransaction } from '../../Database/transaction_helper';
import { Login } from '../models/login';
import { Auth } from '../models/auth';
import { StatusAuth } from '../models/status-auth';
import { DeviceAuth } from '../models/device-auth';
import { UserPage } from '../models/user-page';
import { TokenLogin, Token_New_Device, TokenRefresh, TokenAuthUser } from '../../Secure/interfaceToken';
import { generateTokenAccess, generateTokenRefresh, generateTokenValidCode } from '../../Secure/generateTokens';
import { CodeAutentication } from '../models/code-autentication';
import { CodeAutenticationService } from './code_autentication.service';
import { User } from '../models/user';
import { Date_addDays } from '../../Utils/fecha';
import { RefreshToken, RefreshTokenAttributes } from '../models/refresh-token';
import { maskEmail } from '../../Mails/maskEmail';


const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');


interface LoginParams {
    Username: string;
    Password?: string;
    Code?: string;
}

export interface ParamsLogin {
    Login: LoginParams
    withToken: boolean;
    deviceToken?: string; // Opcional si ya existe el token del dispositivo
    deviceInfo?: DevicesCreationAttributes; // Opcional si no hay token
}

export class LoginService {
    public async _login(params: ParamsLogin, whithCode: boolean = false): Promise<ServiceResult<any>> {
        return await this._login_pv(params, whithCode)
    }

    private async _login_pv(params: ParamsLogin, whithCode: boolean = false): Promise<any> {
        return await withTransaction(async (transaction) => {
            try {
                const { withToken, deviceToken, deviceInfo } = params

                //Valida parametros
                const infoAuth = await this.fc_validParams_login(params.Login, whithCode);
                if (infoAuth.status !== 200) {
                    return errorResult({
                        status: infoAuth.status,
                        message: infoAuth.message
                    });
                }

                //obtiene lista de login
                const { body } = infoAuth
                const IdAuth = body.IdAuth;
                const listLogin = await Login.findAll({
                    where: { IdAuth }
                });


                //########### PRIMER LOGIN VALIDA LOGIN Y TOKEN
                if (listLogin.length === 0) {
                    if (!deviceInfo) {
                        throw throwServerError({
                            message: 'No se encuentra el registro',
                            status: 409,
                        });
                    }
                    return await this.lg_first_LOGIN(deviceInfo, body, transaction);

                }

                //########### (EXISTE Dispositivo) MÁS DE UN LOGUEO 
                if (withToken && listLogin.length >= 1) {
                    //deviceToken, infoAuth
                    if (!deviceToken) {
                        return errorResult({
                            status: 400,
                            message: 'El token del dispositivo es requerido pero no se proporcionó.'
                        });
                    }
                    return await this.lg_existDevice_LOGIN(deviceToken, body, transaction);
                }

                //########### (NUEVO DISPOSITIVO) MÁS DE UN LOGUEO
                if (!withToken && listLogin.length >= 1) {
                    return await this.lg_newDevice_LOGIN(body, transaction);
                }

            } catch (err: any) {
                handleServiceError(err, '_login_pv', 'AuthService');
            }
        })
    }

    private async fc_validParams_login(params: LoginParams, whithCode: boolean): Promise<ServiceResult<any>> {
        try {
            const { Username, Password } = params;

            const dataAuth = await Auth.findOne({ where: { Username } })
            if (!dataAuth) {
                return errorResult({
                    status: 400,
                    message: 'Usuario o contraseña incorrectas'
                });
            }

            if (dataAuth.Status === 1) {
                // --- Enviar correo con codigo de verificacion de email
                return successResult({
                    status: 200,
                    message: `Confirma tu correo electrónico, mediante el código de verificación`,
                });
            }

            //verifica el status que este activo el user
            if (dataAuth.Status !== 2 && dataAuth.Status != 3) {
                const status = await StatusAuth.findByPk(dataAuth.Status)
                return errorResult({
                    status: 422,
                    message: `${status?.Description}`
                });
            }

            if (!whithCode) {
                const isPasswordValid = await bcrypt.compare(Password, dataAuth.Password);
                if (!isPasswordValid) {
                    throw throwServerError({
                        status: 409,
                        message: 'No cuentas con permisos para hacer login'
                    });
                }
            }

            return successResult({
                status: 200,
                message: 'Bienvenido',
                body: dataAuth
            });

        } catch (err: any) {
            handleServiceError(err, 'fc_validParams_login', 'AuthService');
        }
    }
    private async lg_first_LOGIN(deviceInfo: DevicesCreationAttributes, dataAuth: Auth, transaction: any) {

        try {
            const IdAuth = dataAuth.IdAuth;
            //* Crear registro en tabla Device          
            const device = await this._createDevice(deviceInfo, transaction)
            /**Se crea un registro en DeviceAuth */
            const deviceaAuth = await DeviceAuth.create({ IdAuth, IdDevice: device.IdDevices }, { transaction });

            //* se crea un registro en tabla Login con (IdAuth, IdDevice) con activo true 
            const login = await this._createLogin(dataAuth.IdAuth, deviceaAuth.IdDeviceAuth, transaction)

            /**Se obtiene valor del la pagina de usuario para el TOKEN_ACCESS*/
            const userPage = await UserPage.findOne({ where: { IdUser: dataAuth.IdUser } });
            if (!userPage) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 404,
                });
            }

            const _tokenRefresh: TokenRefresh = {
                IdAuth: IdAuth,
                IdDeviceAuth: deviceaAuth.IdDeviceAuth,
                IdUserPage: userPage.IdUserPage,
            };
            const { status, message, error, body } = await this.newRefreshToken(_tokenRefresh)
            if (error) {
                throw throwServerError({
                    status: status,
                    message: 'Error en el servicio al generar token'
                });
            }

            const { dataRefresh, token } = body

            /**Se optiene datos del usuario y se generan el Access token */
            const dataAccessToken: TokenLogin = { IdUser: dataAuth.IdUser, IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
            const tokenLogin = generateTokenAccess(dataAccessToken);
            // const tokenLogin = await generateAccessToken(dataAccessToken)
            if (tokenLogin.code != 200) {
                throw throwServerError({
                    status: 409,
                    message: 'Error en el servicio al generar token'
                });
            }

            /**Se Genera un UUID y se actualiza en la tabla Device */
            const deviceToken = uuidv4();
            device.Token = deviceToken
            await this._updateDevice(device, transaction)

            return successResult({
                status: 200,
                message: '¡Inicio de sesión exitoso! Bienvenido.',
                body: {
                    deviceVerify: true,
                    firstLogin: true,
                    TOKEN_ACCESS: tokenLogin.token,
                },
                tokens: {
                    TOKEN_DEVICE: deviceToken,
                    TOKEN_REFRESH: `Bearer ${token}`,
                }
            });

        } catch (err: any) {
            handleServiceError(err, 'lg_first_LOGIN', 'AuthService');
        }
    }
    private async _createDevice(deviceInfo: DevicesCreationAttributes, transaction?: Transaction): Promise<Devices> {
        try {
            const devices = await Devices.create(deviceInfo, { transaction });
            return devices
        } catch (err: any) {
            handleServiceError(err, '_createDevice', 'AuthService');
        }
    }
    private async _createLogin(IdAuth: number, IdDeviceAuth: number, transaction?: Transaction): Promise<Login> {
        try {

            return await Login.create({
                IdAuth,
                IdDeviceAuth
            }, { transaction });
        } catch (err: any) {
            handleServiceError(err, '_createLogin', 'AuthService');
        }
    }

    private async newRefreshToken({ IdAuth, IdDeviceAuth, IdUserPage }: TokenRefresh, transaction?: Transaction): Promise<ServiceResult<any>> {
        try {

            if (!IdAuth && !IdDeviceAuth && !IdUserPage) {
                return errorResult({
                    status: 409,
                    message: 'Se necesita la información para generar token'
                })
            }

            // const tokenRefresh = await this._generateToken(dataRefreshToken, 'Refresh', `${expiracionDias}d`);
            const tokenRefresh = generateTokenRefresh({ IdAuth, IdDeviceAuth, IdUserPage })
            if (!tokenRefresh.token || tokenRefresh.code != 200) {
                throw throwServerError({
                    status: 409,
                    message: 'Error en el servicio al generar token'
                });
            }

            const insertTokenRefresh = {
                IdRefreshToken: 0,
                IsActive: true,
                Token: tokenRefresh.token,
                IdAuth: IdAuth,
                IdDeviceAuth: IdDeviceAuth,
                IdUserPage: IdUserPage,
                ExpiresAt: Date_addDays(tokenRefresh.expiresIn)
            };

            const dataTokenRefresh = await this.createRefreshToken(insertTokenRefresh, transaction)
            if (!dataTokenRefresh) {
                throw throwServerError({
                    status: 500,
                    message: 'Falla en la base de datos.'
                });
            }

            const dataRefresh = {
                IdRefreshToken: dataTokenRefresh.IdRefreshToken,
                ExpiresAt: dataTokenRefresh.ExpiresAt || new Date(),
            }
            return successResult({
                body: {
                    dataRefresh,
                    token: dataTokenRefresh.Token
                },
                status: 200,
                message: 'Se creo el token Refresh'
            })

        } catch (err: any) {
            handleServiceError(err, 'newRefreshToken', 'AuthResult');
        }

    }
    private async createRefreshToken(
        { Token, ExpiresAt, IsActive = true, IdAuth, IdDeviceAuth, LastUsedAt }: RefreshTokenAttributes,
        transaction?: Transaction): Promise<RefreshToken> {
        try {
            const refreshToken = await RefreshToken.create({
                Token,
                ExpiresAt,
                IsActive,
                IdAuth,
                IdDeviceAuth,
                LastUsedAt
            }, { transaction });

            return refreshToken;
        } catch (err: any) {
            handleServiceError(err, 'createRefreshToken', 'AuthResult');
        }
    }
    private async _updateDevice(deviceInfo: Devices, transaction: Transaction): Promise<Devices> {
        try {
            const devices = await deviceInfo.update({ ...deviceInfo, Token: deviceInfo.Token }, { transaction });
            return devices
        } catch (err: any) {
            handleServiceError(err, '_updateDevice', 'AuthService');
        }
    }
    private async lg_existDevice_LOGIN(deviceToken: string, dataAuth: Auth, transaction: any) {
        try {
            const IdAuth = dataAuth.IdAuth;

            /**Se obtiene el registro el device por uuid */
            const device = await Devices.findOne({
                where: { Token: deviceToken }
            })
            if (!device) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });

            }

            // Validar si no tiene codigos pendientes que verificar en esttus 6 (6='Registro de dispositivo')
            const dataActivo = await CodeAutentication.findOne({
                where: {
                    IdAuth: dataAuth.IdAuth,
                    IsActive: true,
                    IdTypeCode: 6
                }
            })
            if (dataActivo?.IsActive) {
                //SE TIENE UN CODIGO PENDIENTE POR VALIDAR 
                const response = await this.lg_newDevice_LOGIN(dataAuth, transaction)
                return response;
            }

            //* Actualiza en tabla login todos los registros en el campo activo=false donde el idDevice sea el del token
            const deviceAuth = await DeviceAuth.findOne({
                where: { IdDevice: device.IdDevices, IdAuth }
            })
            if (!deviceAuth) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }
            await this._updateLoginToInactive(deviceAuth.IdDeviceAuth, IdAuth)



            /**Se optiene datos del usuario y se generan el Access token */
            const userPage = await UserPage.findOne({ where: { IdUser: dataAuth.IdUser } });
            if (!userPage) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }


            const _tokenRefresh: TokenRefresh = {
                IdAuth: IdAuth,
                IdDeviceAuth: deviceAuth.IdDeviceAuth,
                IdUserPage: userPage.IdUserPage,
            };
            const { status, message, error, body } = await this.newRefreshToken(_tokenRefresh)
            if (error) {
                throw throwServerError({
                    status: 409,
                    message: 'Error en el servicio al generar token'
                });
            }

            const { dataRefresh, token } = body

            /**se crea un registro en tabla login con (IdAuth, IdDeviceAuth) con activo true */
            const login = await this._createLogin(dataAuth.IdAuth, deviceAuth.IdDeviceAuth, transaction)

            const dataAccessToken: TokenLogin = { IdUser: dataAuth.IdUser, IdAuth: dataAuth.IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
            const tokenLogin = generateTokenAccess(dataAccessToken);
            if (tokenLogin.code != 200) {
                throw throwServerError({
                    status: 409,
                    message: 'Error en el servicio al generar token'
                });
            }

            return successResult({
                status: 200,
                message: '¡Inicio de sesión exitoso! Bienvenido de nuevo.',
                body: {
                    deviceVerify: true,
                    firstLogin: false,
                    TOKEN_ACCESS: tokenLogin.token,
                },
                tokens: {
                    TOKEN_REFRESH: `Bearer ${token}`,
                }
            });

        } catch (err: any) {
            handleServiceError(err, 'lg_existDevice_LOGIN', 'AuthService');
        }
    }
    private async _updateLoginToInactive(IdDeviceAuth: number, IdAuth: number): Promise<void> {
        try {
            await Login.update({ Active: false }, {
                where: { IdAuth, IdDeviceAuth }
            })
        } catch (err: any) {
            handleServiceError(err, '_updateLoginToInactive', 'AuthService');
        }
    }
    private async lg_newDevice_LOGIN(dataAuth: Auth, transaction: any) {
        /** Se usa mismo metodo para generar un codigo nuevo y enviar por correo cuando:
         * es nuevo dispositivo y 
         * cuando esta pendiente por activar un codigo
         */
        try {
            const IdAuth = dataAuth.IdAuth;

            /**SE CREA OTRO CÓDIGO PARA VALIDAR EL DISPOSITIVO */
            const code_AutService = new CodeAutenticationService();
            const codeAuth = await code_AutService.createNewwCode({
                IdAuth,
                IdTypeCode: 6, //(6='Registro de dispositivo')    
            }, transaction);
            if (!codeAuth) {
                throw throwServerError({
                    status: 409,
                    message: 'No se genero código'
                });
            }

            /**SE OTIEN LOS DATOS DEL USUARIO */
            const userData = await User.findByPk(dataAuth.IdUser)
            if (!userData) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            /**se manda codigo por correo  */
            const code = codeAuth.Code
            await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code || '');

            /**Se genera token */
            const tokenNewDevice: Token_New_Device = { IdAuth };
            const tokenValidCode = generateTokenValidCode(tokenNewDevice);
            if (tokenValidCode.code != 200) {
                throw throwServerError({
                    status: 409,
                    message: 'Error en el servicio al generar token'
                });
            }

            return successResult({
                status: 200,
                message: '¡Correo enviado con éxito! Hemos enviado un código para verificar tu nuevo dispositivo.',
                body: {
                    deviceVerify: false,
                    firstLogin: false,
                    TOKEN_NEWDEVICE: tokenValidCode.token,
                },
                tokens: null
            });

        } catch (err: any) {
            handleServiceError(err, 'lg_validCodeDevice', 'AuthService');
        }
    }
    private async _sendMailVerifyDevice(Email: string, Name: string, Firstname: string, Code: string): Promise<any> {
        try {
            const mailConfig: MailServiceConfig = {
                accion: MailActions.NuevoDispositivo,
                to: Email,
                subject: 'Verificar nuevo dispositivo',
                dataMail: {
                    name: Name,
                    firstname: Firstname,
                    code: Code,
                }
            };
            const mailService = new MailService(mailConfig);
            const responseMail = await mailService.send();
        } catch (err: any) {
            handleServiceError(err, '_sendMailVerifyDevice', 'AuthService');
        }

    }
    protected async fc_validViewNewDevice(dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
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
            const user = await User.findOne({
                where: { IdUser: auth.IdUser }
            })
            if (!user) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }


            return successResult({
                status: 200,
                message: 'Se permite su acceso para validar el dispositivo',
                body: {
                    email: maskEmail(user.Email)
                }
            });

        } catch (err: any) {
            handleServiceError(err, 'lg_validCodeDevice', 'AuthService');
        }
    }

    protected async lg_validCodeDevice(Code: string, TOKEN_NEWDEVICE: TokenAuthUser, deviceInfo: DevicesCreationAttributes): Promise<ServiceResult<any>> {
        return await this.lg_ValidCodeDevic_pv(Code, TOKEN_NEWDEVICE, deviceInfo)
    }
    private async lg_ValidCodeDevic_pv(Code: string, dataToken: TokenAuthUser, deviceInfo: DevicesCreationAttributes): Promise<any> {
        return await withTransaction(async (transaction) => {
            try {

                /**Se obtiene los datos de Auth */
                const { IdAuth } = dataToken
                if (!IdAuth) {
                    throw throwServerError({
                        message: 'No se encuentra los datos del token',
                        status: 401,
                    });
                }




                const authData = await Auth.findByPk(IdAuth)
                if (!authData) {
                    throw throwServerError({
                        message: 'No se encuentra el registro',
                        status: 409,
                    });
                }

                /**Se valida el codigó recibido */
                const code_AutService = new CodeAutenticationService();
                const validCode = await code_AutService.validCode(Code, IdAuth);
                if (validCode == 0) {
                    return errorResult({
                        status: 422,
                        message: 'Código incorrecto'
                    });
                }


                //Crear registro en tabla Device y DeviceAuth 
                const deviceToken = uuidv4();
                deviceInfo.Token = deviceToken
                const device = await this._createDevice(deviceInfo, transaction)
                const deviceAuth = await DeviceAuth.create({ IdAuth, IdDevice: device.IdDevices }, { transaction });

                /**SE OBTIENE LOS VALORES DE USER PARA EL TOKEN ACCESS */
                const userPage = await UserPage.findOne({ where: { IdUser: authData.IdUser } });
                if (!userPage) {
                    throw throwServerError({
                        message: 'No se encuentra el registro',
                        status: 409,
                    });
                }


                const _tokenRefresh: TokenRefresh = {
                    IdAuth: IdAuth,
                    IdDeviceAuth: deviceAuth.IdDeviceAuth,
                    IdUserPage: userPage.IdUserPage,
                };

                const { status, message, error, body } = await this.newRefreshToken(_tokenRefresh)
                if (error) {
                    throw throwServerError({
                        status: 409,
                        message: message
                    });
                }

                const { dataRefresh, Token } = body

                //*Se crea un registro en tabla login con (IdAuth, IdDeviceAuth) con campo activo=true  
                const login = await this._createLogin(IdAuth, deviceAuth.IdDeviceAuth, transaction)

                const dataAccessToken: TokenLogin = { IdUser: authData.IdUser, IdAuth: IdAuth, IdUserPage: userPage.IdUserPage, IdLogin: login.IdLogin, dataRefresh };
                const tokenLogin = generateTokenAccess(dataAccessToken);
                if (tokenLogin.code != 200) {
                    throw throwServerError({
                        status: 409,
                        message: 'Error en el servicio al generar token'
                    });
                }

                return successResult({
                    status: 200,
                    message: '¡Dispositivo verificado con éxito! Ahora puedes acceder a tu cuenta de manera segura.',
                    body: {
                        deviceVerify: true,
                        firstLogin: false,
                        TOKEN_ACCESS: tokenLogin.token,
                    },
                    tokens: {
                        TOKEN_REFRESH: `Bearer ${Token}`,
                        TOKEN_DEVICE: deviceToken,
                    }
                });

            } catch (err: any) {
                handleServiceError(err, 'lg_ValidCodeDevic_pv', 'AuthService');
            }
        })
    }
    protected async fc_newCode_NewDevice(dataToken: TokenAuthUser): Promise<ServiceResult<any>> {
        try {
            /**Se obtiene los datos con el token */
            const { IdAuth } = dataToken
            if (!IdAuth) {
                return errorResult({
                    message: `Token invalido`,
                    status: 400,
                });
            }

            const auth = await Auth.findByPk(IdAuth)
            if (!auth) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            /**Se crea un nuevo Codigo */
            const code_AutService = new CodeAutenticationService();
            const codeAuth = await code_AutService.createNewwCode({
                IdAuth: IdAuth,
                IdTypeCode: 6 //(6='Registro de dispositivo')
            });
            if (!codeAuth) {
                throw throwServerError({
                    status: 409,
                    message: 'No se genero código'
                });
            }

            /**Se obtiene los datos del usuario */
            const userData = await User.findByPk(auth.IdUser)
            if (!userData) {
                throw throwServerError({
                    message: 'No se encuentra el registro',
                    status: 409,
                });
            }

            /**Se oenvia código por correo */
            const code = codeAuth.Code
            await this._sendMailVerifyDevice(userData.Email, userData.Name, userData.Firstname, code || '');

            return successResult({
                status: 200,
                message: 'Se ha enviado correo con nuevo código'
            });

        } catch (err: any) {
            handleServiceError(err, 'lg_validCodeDevice', 'AuthService');
        }
    }

}