import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository, DbUser } from './auth.repository.js';
import { LoginInput } from './auth.schema.js';
import { AppError } from '../../middleware/error.js';
import { OjsClient } from '../sync/ojs.client.js';

export interface UserResponse {
  id: string;
  email: string;
  role: 'reader' | 'author' | 'admin';
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private ojsClient: OjsClient
  ) {}

  /**
   * Authenticate user credentials against OJS API directly.
   */
  async login(data: LoginInput): Promise<UserResponse> {
    // 1. Authenticate with OJS Master Identity Provider
    const ojsUser = await this.ojsClient.authenticateUser(data.email, data.password);
    
    if (!ojsUser) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // 2. Ensure the user exists in our local database mirror
    let localUser = await this.authRepository.findByEmail(data.email);
    
    if (!localUser) {
      // First time logging in from OJS, create a shadow profile
      localUser = await this.authRepository.createUser({
        email: data.email,
        firstName: ojsUser.firstName,
        lastName: ojsUser.lastName,
        role: ojsUser.role || 'author', // Default to author if missing
      });
    }

    return this.sanitizeUser(localUser);
  }

  /**
   * Generate access and refresh tokens.
   */
  generateTokens(user: UserResponse): { accessToken: string; refreshToken: string } {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new AppError(500, 'JWT secrets are not configured in the environment', 'CONFIG_ERROR');
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      accessSecret,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      refreshSecret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Refresh the access token using a valid refresh token.
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string; user: UserResponse }> {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new AppError(500, 'JWT secrets are not configured in the environment', 'CONFIG_ERROR');
    }

    try {
      const decoded = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload & { sub: string };
      const user = await this.authRepository.findById(decoded.sub);
      
      if (!user) {
        throw new AppError(401, 'User associated with this token no longer exists', 'UNAUTHORIZED');
      }

      const sanitizedUser = this.sanitizeUser(user);
      const accessToken = jwt.sign(
        { sub: sanitizedUser.id, email: sanitizedUser.email, role: sanitizedUser.role },
        accessSecret,
        { expiresIn: '7d' }
      );

      return { accessToken, user: sanitizedUser };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(401, 'Invalid or expired refresh token', 'UNAUTHORIZED');
    }
  }

  /**
   * Get user profile details by ID.
   */
  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.authRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Remove password hash from the user object.
   */
  private sanitizeUser(user: DbUser): UserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role as 'reader' | 'author' | 'admin',
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
