export interface AuthPayload  {
    IdAuth: number;
    IdUser?: string;
}

export interface JwtOptions  {
  dataToken: AuthPayload
  expiresIn?: string
  secretType?: 'access' | 'refresh';
}
