import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository, DbUser } from './auth.repository.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { AppError } from '../../middleware/error.js';

export interface UserResponse {
  id: string;
  email: string;
  role: 'reader' | 'author' | 'editor' | 'admin';
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Register a new reader user.
   */
  async register(data: RegisterInput): Promise<UserResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'Email address is already in use', 'EMAIL_ALREADY_EXISTS');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const newUser = await this.authRepository.createUser({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'reader',
    });

    return this.sanitizeUser(newUser);
  }

  /**
   * Authenticate user credentials.
   */
  async login(data: LoginInput): Promise<UserResponse> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    return this.sanitizeUser(user);
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
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      refreshSecret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Remove password hash from the user object.
   */
  private sanitizeUser(user: DbUser): UserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
