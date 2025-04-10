import jwt from 'jsonwebtoken';

const accessSecretKey = 'accessSecretKey';
const refreshSecretKey = 'refreshSecretKey';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private refreshTokens: Set<string>;

  constructor() {
    this.refreshTokens = new Set();
  }

  // Genera un token de acceso y un token de refresco
  public generateTokens(userId: string): Tokens {
    const accessToken = jwt.sign({ userId }, accessSecretKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, refreshSecretKey, { expiresIn: '30d' });

    this.refreshTokens.add(refreshToken);  // Guardamos el token de refresco

    return { accessToken, refreshToken };
  }

  // Revoca un token de refresco
  public revokeRefreshToken(refreshToken: string): void {
    this.refreshTokens.delete(refreshToken);
  }

  // Renueva el token de acceso usando el token de refresco
  public refreshAccessToken(refreshToken: string): string {
    if (!this.refreshTokens.has(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    const decoded = jwt.verify(refreshToken, refreshSecretKey) as { userId: string };
    const newAccessToken = jwt.sign({ userId: decoded.userId }, accessSecretKey, { expiresIn: '15m' });

    return newAccessToken;
  }

  // Verifica el token de acceso
  public verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, accessSecretKey);
    } catch (err) {
      throw new Error('Invalid access token');
    }
  }
}
