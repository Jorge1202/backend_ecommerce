import { Request, Response } from 'express';
import { AuthService } from './auth.service';

// Controlador para generar tokens
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Endpoint para login y generar tokens
  public login(req: Request, res: Response): void {
    const { userId } = req.body; // Ejemplo, podrías tener más validación

    const { accessToken, refreshToken } = this.authService.generateTokens(userId);
    res.json({ accessToken, refreshToken });
  }

  // Endpoint para refrescar el token de acceso
  public refreshAccessToken(req: Request, res: Response): void {
    const { refreshToken } = req.body;

    try {
      const newAccessToken = this.authService.refreshAccessToken(refreshToken);
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(401).send('Invalid refresh token');
    }
  }
}
