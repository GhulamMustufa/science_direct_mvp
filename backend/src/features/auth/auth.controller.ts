import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { AppError } from '../../middleware/error.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handle user registration.
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = registerSchema.parse(req.body);
      const user = await this.authService.register(input);
      const tokens = this.authService.generateTokens(user);

      this.setTokenCookies(res, tokens);

      res.status(201).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle user login.
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = loginSchema.parse(req.body);
      const user = await this.authService.login(input);
      const tokens = this.authService.generateTokens(user);

      this.setTokenCookies(res, tokens);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle user logout.
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = process.env.NODE_ENV === 'production';

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
      });

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle token refresh.
   */
  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new AppError(401, 'Refresh token is missing', 'UNAUTHORIZED');
      }

      const result = await this.authService.refresh(refreshToken);
      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({
        success: true,
        data: { user: result.user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve current authenticated user profile.
   */
  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const user = await this.authService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Set HTTP-only secure cookies for access and refresh tokens.
   */

  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string }
  ): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
