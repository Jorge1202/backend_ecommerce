export interface TokenLogin {
  IdUser: string;
  IdAuth: number;
  IdUserPage: number;
  IdLogin: number;
  dataRefresh: DataRefresh
}
interface DataRefresh {
  IdRefreshToken: number
  ExpiresAt: Date
}
export interface TokenDevice {
  IdDevice: number;
}
export interface TokenRefresh {
  IdAuth: number;
  IdDeviceAuth: number;
  IdUserPage: number;
}

export interface Token_New_Device {
  IdAuth: number;
}
export interface TokenAuthUser {
  IdAuth?: number;
  IdUser?: string;
}

export type TokenData = TokenLogin | TokenDevice | TokenRefresh | Token_New_Device | TokenAuthUser;

export interface Token {
  dataToken: TokenData
  expiresIn?: string
  secretType?: string
}
