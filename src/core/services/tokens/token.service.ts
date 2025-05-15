import { Auth } from '../../../api/v1/models/auth';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { AuthPayload, TokenRefresh, TokenAccess, TokenData } from '../../../common/interfaces/tokens';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { ServiceResponse } from '../../../common/interfaces/service-response';
import { Transaction } from 'sequelize';
import { generateToken, verifyToken } from '../../../common/utils/authenticationToken';
import { RefreshToken } from '../../../api/v1/models/refresh-token';

interface BodyToken {    
    IdRefreshToken: number,
    token: string
}

interface Response {
    error: boolean,
    message: string,
    status: number,
    body?: {
        token: string,
        expiresIn: Date
    },
}

export class TokenService {
    private refreshTokens: Set<string>;

    constructor() {
      this.refreshTokens = new Set();
    }

    public async validateToken(dataToken: AuthPayload, transaction?:Transaction): Promise<ServiceResponse<{ IdAuth: number, auth: Auth }>> {
        try {
            const { IdAuth, IdUser } = dataToken;

            if (!IdAuth) {
                return CriticalError({
                    status: HttpStatus.BAD_REQUEST,
                    message: `Token inválido`
                });
            }

            const auth = await Auth.findOne({
                where: { IdAuth },
                transaction
            },);

            if (!auth) {
                return CriticalError({
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'No autorizado para realizar esta acción'
                });
            }

            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Token válido',
                body: {
                    IdAuth,
                    IdUser,
                    auth,
                },
            });

        } catch (error: any) {
            ErrorHandler.handleServiceError(error, 'verifyEmailRegister', 'NewUserService');
        }
    }

    public async generateRefreshToken(dataTken: TokenRefresh, transaction?: Transaction): Promise<ServiceResponse<BodyToken>> {
        try {
            // Paso 1: Desestructurar los identificadores del objeto recibido
            const { IdAuth, IdUser, IdDevice, IdUserPage } = dataTken;

            // Paso 2: Validar que al menos uno de los IDs requeridos esté presente
            if (!IdAuth && !IdDevice && !IdUserPage && !IdUser) {
                return ErrorResult({
                    status: HttpStatus.CONFLICT,
                    message: 'Se necesita la información para generar token'
                });
            }

            
            // Paso 3: Crear el registro para el nuevo token en la base de datos
            const resToken = await RefreshToken.create({
                Token:'sin Token',
                IdAuth,
                IdDevice,
            }, { transaction });
            
            
            // Paso 4: Construir el objeto base para generar el token
            const objTokenRefresh = {
                IdAuth,
                IdUser,
                IdDevice,
                IdUserPage,
                IdRefreshToken: resToken.IdRefreshToken
            };            

            // Paso 5: Generar un JWT de tipo refresh con duración de 30 días
            const { Token, ExpiresIn } = generateToken({
                dataToken: objTokenRefresh,
                expiresIn: `30d`,
                secretType: 'refresh'
            });

            //Actualizamos el registro en la base de datos
            await resToken.update({Token, ExpiresAt:ExpiresIn }, {transaction})
            
            //Crear el registro del nuevo token en memoria
            this.refreshTokens.add(Token); 

            // Paso 6: Validar si se creó correctamente el token
            if (!resToken) {
                return CriticalError({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Falla al crear el registro Token.'
                });
            }


            // Paso 7: Retornar éxito con el token generado y sus datos
            return SuccessResult({
                status: HttpStatus.OK,
                message: 'Se creó el token Refresh',
                body: {
                    IdRefreshToken: resToken.IdRefreshToken,
                    token: Token
                },
            });

        } catch (error: any) {
            // Paso 9: Manejo de errores centralizado
            ErrorHandler.handleServiceError(error, 'newRefreshToken', 'TokenService');
        }
    }

    public generateTokenAccess(data: TokenAccess): Response {
        try {

            const {IdAuth, IdUserPage, IdUser, IdRefreshToken} = data
            
            // Paso 1: Validación - Verifica que existan los campos necesarios para generar el token
            if (!IdAuth || !IdUserPage || !IdUser) {
                return {
                    error: true,
                    message: 'Faltan datos para generar el token de Access',
                    status: 409,
                };
            }
            
            const dataAccessToken = { 
                IdUser,
                IdAuth,
                IdUserPage, 
                IdRefreshToken,
            };
            // Paso 2: Genera el token JWT con los datos y tiempo de expiración
            const { Token, ExpiresIn } = generateToken({
                dataToken: dataAccessToken,
                expiresIn: `1h`, // 1 hora
            });
    
            // Paso 3: Retorna una respuesta exitosa con el token generado y su tiempo de expiración
            return {
                error: false,
                status: 200,
                message: '',
                body: {
                    token: Token,
                    expiresIn: ExpiresIn
                }
            };
    
        } catch (error: any) {
            // Paso 4: Manejo centralizado del error si algo falla durante el proceso
            ErrorHandler.handleServiceError(error, 'newRefreshToken', 'TokenService');
        }
    }

    public async reNewAccessToken(refreshToken: string): Promise<ServiceResponse<{ TOKEN_ACCESS: string, TOKEN_REFRESH: string }>> {
        // 1. Validación inicial del refreshToken en caché/local
        if (!this.refreshTokens.has(refreshToken)) {
            throw CriticalError({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Token para actualización no reconocido'
            });
        }
    
        // 2. Verificación del token
        const { error, message, payload } = await verifyToken(refreshToken, 'refresh');
        if (error || !payload) {
            throw CriticalError({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: message || 'Token inválido'
            });
        }
    
        // 3. Validación de estructura del payload
        if (!this.isTokenRefresh(payload)) {
            throw CriticalError({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'El payload no tiene el formato esperado de Token'
            });
        }
    
        const {
            IdRefreshToken,
            IdAuth,
            IdDevice,
            IdUserPage,
            IdUser
        } = payload as TokenRefresh;
    
        // 4. Validar tiempo restante del token
        const estaPorExpirar = await this.validaTokenRefresh(IdRefreshToken!, refreshToken);
        if (estaPorExpirar === null) {
            throw CriticalError({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'No se encontró la fecha de expiración del token'
            });
        }
    
        // 5. Obtener nuevo refresh token si está por expirar
        let tokenRefreshFinal = refreshToken;
        let idRefreshTokenFinal = IdRefreshToken!;
    
        if (estaPorExpirar) {
            //generar nuevo token refresh  si la expiración es menor a 1 hora
            const { body, error: errNuevoToken, message: msgNuevoToken } = await this.generateRefreshToken(payload);
            if (errNuevoToken || !body) {
                throw CriticalError({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: msgNuevoToken || 'Error al generar nuevo token de actualización'
                });
            }
    
            tokenRefreshFinal = body.token;
            idRefreshTokenFinal = body.IdRefreshToken;
        }
    
        // 6. Generar nuevo token de acceso
        const tokenAccessPayload: TokenAccess = {
            IdRefreshToken: idRefreshTokenFinal,
            IdAuth,
            IdUserPage,
            IdUser
        };
    
        const { body: accessBody, error: accessError, message: accessMessage } = this.generateTokenAccess(tokenAccessPayload);
        if (accessError || !accessBody) {
            throw CriticalError({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: accessMessage || 'Error al generar token de acceso'
            });
        }
    
        // 7. Retornar ambos tokens
        return SuccessResult({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: accessMessage || 'Error al generar token de acceso',
            body: {
                TOKEN_ACCESS: accessBody.token,
                TOKEN_REFRESH: `Bearer ${tokenRefreshFinal}`,
            }
        });
        
        
        
    }
        
    public revokeRefreshToken(refreshToken: string): void {
        this.refreshTokens.delete(refreshToken);
    }

    private isTokenRefresh(payload: TokenData): payload is TokenRefresh {
        return (
          (payload as TokenRefresh).IdDevice !== undefined &&
          (payload as TokenRefresh).IdUserPage !== undefined
        );
    }

    private async validaTokenRefresh(IdRefreshToken: number, refreshToken: string): Promise<boolean | null>{

        const dataTokenRefresBD = await RefreshToken.findOne({
            where: {
              IdRefreshToken,
              Token: refreshToken,
              IsActive: true
            }
        });     

        if (!dataTokenRefresBD?.ExpiresAt) {
            console.log('No se encontró fecha de expiración');
            return null;
        }

        const fechaExpiracion = new Date(dataTokenRefresBD.ExpiresAt);
        const ahora = new Date();
        const diferenciaMs = fechaExpiracion.getTime() - ahora.getTime(); // diferencia en milisegundos
        
        const unaHoraEnMs = 60 * 60 * 1000;
        
        const menosDeUnaHora = diferenciaMs < unaHoraEnMs;
        
        console.log(menosDeUnaHora); 
        
        // true si queda menos de 1 hora
        // false si queda más de 1 hora
  
        return menosDeUnaHora
    }
}

export default new TokenService()
