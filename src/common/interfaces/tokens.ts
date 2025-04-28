export type TokenData = AuthPayload | TokenAccess | TokenRefresh

export interface JwtOptions  {
  dataToken: TokenData
  expiresIn: string
  secretType?: 'access' | 'refresh';
}

export interface ReturnToken {
  Token:string, 
  ExpiresIn:Date 
}

export interface AuthPayload  {
  IdAuth: number;
  IdUser: string;
}

interface DataImportantToken extends AuthPayload {
  IdUserPage: number;
}

export interface TokenAccess extends DataImportantToken {
  IdRefreshToken: number  
}


export interface TokenRefresh extends DataImportantToken {
  IdDevice: number;
  IdRefreshToken?: number  
}

