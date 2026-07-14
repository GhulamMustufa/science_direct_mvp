import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository, DbUser } from './auth.repository.js';
import { LoginInput } from './auth.schema.js';
import { AppError } from '../../middleware/error.js';

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
    private authRepository: AuthRepository
  ) {}

  /**
   * Authenticate user credentials locally.
   */
  async login(data: LoginInput): Promise<UserResponse> {
    const localUser = await this.authRepository.findByEmail(data.email);
    
    if (!localUser || !localUser.passwordHash) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(data.password, localUser.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    return this.sanitizeUser(localUser);
  }

  /**
   * Register a new user locally.
   */
  async register(data: import('./auth.schema.js').RegisterInput): Promise<UserResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists', 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = await this.authRepository.createUser({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'author', // Defaulting to author
    });

    return this.sanitizeUser(newUser);
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
