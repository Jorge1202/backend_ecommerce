import { HistoryRegister } from '../models/history-register';
import { User } from '../models/user'; 


import { ServiceResponse, SuccessParams } from '../../../common/interfaces/service-response';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { logger } from '../../../core/logger';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { NewUser, TokenValidEmail } from '../../shared/interfaces/newUser';
import { CodeAutentication } from '../models/code-autentication';
import { Auth } from '../models/auth';


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
  
    protected async createHistoryRegister(userData: HistoryRegister): Promise<ServiceResponse<HistoryRegister>> {
        try {

            logger.info(userData);
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
    protected async updateHistoryRegister(userData: HistoryRegister): Promise<ServiceResponse<number>> {
        try {

            const [affectedCount] = await HistoryRegister.update(userData, 
                {
                    where: {    Id: userData.Id }
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

    protected async newUserRegister(userData: NewUser): Promise<ServiceResponse<{Token: string, Email: string}>> {
        try {
            // 🧩 Proceso 1 – Registro inicial:

            // 1️⃣ Recibes los datos del formulario
            // (ej. Email, Username, Name, Password, etc.)
            const { Email, Password, Username, Name, Firstname, Lastname, Genero, Phone } = userData;
            const newUser = {    
                Email,
                Username,
                Name,
                Firstname,
                Lastname,
                Genero,
                Phone
            };


            // 2️⃣ Validas que no existan ya en la base de datos
            // - Buscar si ya hay un usuario con ese Email o Username
            // - Lanzar error si ya existen




            // 3️⃣ Creas el registro en la tabla User
            // - Guardas datos como Name, Email, etc.
            // - Status inicial: pendiente de verificación

            // 4️⃣ Creas el registro en la tabla Auth
            // - Hasheas la contraseña
            // - Asocias el UserId
            // - Generas token de verificación (JWT o random string)

            // 5️⃣ Envías correo con código de verificación
            // - Incluye el token en el enlace
            // - Envía también un código numérico por seguridad

            // 6️⃣ Guardas o actualizas el estado en HistoryRegister
            // - Registro de la acción de registro del usuario
            // - Puedes guardar status como "registro iniciado", "correo enviado", etc.

            // 7️⃣ Respondes al frontend con:
            // - El token de verificación (para el link)
            // - El email enmascarado (ej. y***@gmail.com)
            // - Opcional: tiempo de expiración del token




            
            // const validUser = await this._validExite(newUser);
            // if (validUser.code !== 200) {
            //     return ErrorResult({
            //         status: validUser.code,
            //         message: validUser.message
            //     });
            // }

            return  SuccessResult({
                status: HttpStatus.OK,      
                message: 'Usuario fue creado',
                body: {
                    Token: "",
                    Email:""
                }      
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'newUserRegister', 'NewUserService');
        }
    }

    protected async verifyTokenRegister(dataToken: TokenValidEmail): Promise<ServiceResponse<null>> {
        try {

            // 🧩 Parte de Proceso 2 – Verificación de correo:            
            // 2️⃣ Verificación del token
            // - El backend valida el token de verificación

            const { IdAuth } = dataToken
            if (!IdAuth) {
                return ErrorResult({
                    message: `Token invalido`,
                    status: 400,
                });
            }
            
            //Validar si cuenta con un code estatus 1 (Verificacion de email)
            const IdTypeCode = 1;
            const codeValid = await CodeAutentication.findOne({
                where: { IdTypeCode, IdAuth: IdAuth }
            });
            if (!codeValid) {
                return ErrorResult({
                    status: 422,
                    message: 'No cuenta con solicitud de verificacion de correo'
                });
            }

            
            return  SuccessResult({
                status: HttpStatus.OK,      
                message: 'Vista autorizada'    
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }

    }
    protected async verifyCodeEmailRegister(dataToken: TokenValidEmail, Code: string): Promise<ServiceResponse<{Hash: string}>> {
        try {
            const { IdAuth } = dataToken
            const authData = await Auth.findOne({
                where: { IdAuth }
            })
            if (!authData) {
                return CriticalError({
                    message: 'No se encuentra el registro'
                });
            }


            // 🧩 Proceso 2 – Verificación de correo:
            // 1️⃣ Recibe el token de verificación y el código numérico

            // 3️⃣ El frontend envía al backend:
            // - El token del enlace
            // - El código numérico ingresado por el usuario

            // 4️⃣ El backend valida:
            // - Que el token sea válido y no haya expirado
            // - Que el código ingresado coincida con el que se envió

            // 5️⃣ Si la verificación es exitosa:
            // - Actualizas el status del User a "verificado"
            // - Actualizas Auth para marcar que el correo fue validado
            // - Puedes limpiar los códigos/token ya usados

            // 6️⃣ Creas una nueva Page de perfil para el usuario
            // - Esto dependerá del tipo de sistema (puede ser un perfil público, un panel, etc.)

            // 7️⃣ Finalmente, puedes responder con:
            // - Un nuevo token de sesión (si quieres hacer login automático)
            // - Un mensaje de éxito
            // - O simplemente redireccionar al login o dashboard




            return  SuccessResult({
                status: HttpStatus.OK,      
                message: 'Operación exitosa',
                body: {
                    Hash: "",
                }      
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }
    }







}