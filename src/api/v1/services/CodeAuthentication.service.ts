import { Transaction } from 'sequelize';
import { CodeAutentication, CodeAutenticationCreationAttributes } from '../models/code-autentication';
import { SuccessResult, ErrorResult, CriticalError } from '../../../common/utils/response-servece/service-response';
import { HttpStatus } from '../../../common/constants/httpStatus';
import { ErrorHandler } from '../../../common/utils/response-servece/error-handler';
import { ServiceResponse } from '../../../common/interfaces/service-response';

import { MailActions } from '../../../common/interfaces/mail';
import { prepareAndSendMail } from '../../../common/email/prepareAndSendMail ';
import { generateToken } from '../../../common/utils/authenticationToken';
import { AuthTokens } from '../models/auth-tokens';


interface PropsEmail {
  action: MailActions,
  IdAuth: number,
  IdUser: string,
  Email: string,
  Name: string,
  Firstname: string
  subject: string
  IdTypeCode: number
  TypeTokens: number
}
interface SendVerificarion {
  IdAuth: number,
  IdUser: string,
  Email: string,
  Name: string,
  Firstname: string
}

export class CodeAuthenticationService {
  /**
   * 
   * @param codeData 
   *    IdAuth,
        IdTypeCode, 
   * @param transaction 
   * @returns 
   */
  static async SendVerificationEmail({ IdAuth, IdUser, Email, Name, Firstname }: SendVerificarion, transaction?: Transaction): Promise<string | null> {
    try {
      // Catalogos de la base de datos
      const TypeTokens = 1 //viene de la tabla typeTokens 
      const IdTypeCode = 1 //viene de la tabla type_code


      const objData = {
        action: MailActions.CodeAuth,
        IdAuth,
        IdUser,
        Email,
        Name,
        Firstname,
        subject: 'Activa tu cuenta ahora',
        IdTypeCode,
        TypeTokens
      }


      const codeAuth = new CodeAuthenticationService()
      const Token = await codeAuth.SendCode(objData, transaction)
      return Token

    } catch (error: any) {
      ErrorHandler.handleServiceError(error, 'registerUser', 'NewUserService');
    }
  }
  static async SendVerificationDevice({ IdAuth, IdUser, Email, Name, Firstname }: SendVerificarion, transaction?: Transaction): Promise<string | null> {
    try {

      // Catalogos de la base de datos
      const TypeTokens = 4 //viene de la tabla typeTokens 
      const IdTypeCode = 6 //viene de la tabla type_code

      const objData = {
        action: MailActions.NuevoDispositivo,
        IdAuth,
        IdUser,
        Email,
        Name,
        Firstname,
        subject: 'Solicitud para activar nuevo dispositivo',
        IdTypeCode,
        TypeTokens
      }

      const codeAuth = new CodeAuthenticationService()
      const Token = await codeAuth.SendCode(objData, transaction)
      return Token

    } catch (error: any) {
      ErrorHandler.handleServiceError(error, 'registerUser', 'NewUserService');
    }
  }

  private async SendCode({ IdAuth, IdUser, Email, Name, Firstname, subject, IdTypeCode, TypeTokens, action }: PropsEmail, transaction?: Transaction): Promise<string | null> {
    try {
      // Crear el registro en la tabla CodeAutentication    
      const responseCode = await this.createNewCode({
        IdAuth,
        IdTypeCode,
        Description: subject
      }, transaction);

      const objEmail = {
        accion: action,
        to: Email,
        subject,
        dataMail: {
          name: Name,
          firstname: Firstname,
          code: responseCode.Code,
        }
      }
      await prepareAndSendMail(objEmail)

      const { Token, ExpiresIn } = generateToken({
        dataToken: {
          IdAuth,
          IdUser
        },
        expiresIn: '15m',
      });

      // Guardar el token en la bd
      await AuthTokens.create({
        Token,
        IdAuth,
        TypeTokens,
        ExpiresIn
      }, { transaction });

      return Token
    } catch (error: any) {
      ErrorHandler.handleServiceError(error, 'registerUser', 'NewUserService');
    }
  }

  public async createNewCode(codeData: CodeAutenticationCreationAttributes, transaction?: Transaction): Promise<CodeAutentication> {
    try {
      // 1️⃣ Desactivar códigos anteriores
      await this._deactivatePreviousCodes(codeData, transaction);

      // 2️⃣ Generar código aleatorio
      const newCode = this._generateRandomCode();

      // 3️⃣ Crear nuevo código
      const code = await CodeAutentication.create(
        { ...codeData, Code: newCode },
        { transaction }
      );

      return code;

    } catch (error: any) {
      throw ErrorHandler.handleServiceError(error, 'createNewCode', 'CodeAuthenticationService');
    }
  }

  private async _deactivatePreviousCodes(
    codeData: CodeAutenticationCreationAttributes,
    transaction?: Transaction
  ) {
    await CodeAutentication.update({ IsActive: false }, {
      where: {
        IdAuth: codeData.IdAuth,
        IdTypeCode: codeData.IdTypeCode,
        IsActive: true
      },
      transaction
    });

  }

  private _generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
  }
}


export default new CodeAuthenticationService();