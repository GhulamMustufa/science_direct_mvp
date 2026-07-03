import { ProfileRepository, DbUser, DbAuthor } from './profile.repository.js';
import { UpdateProfileInput } from './profile.schema.js';
import { AppError } from '../../middleware/error.js';

export interface ProfileResponse {
  id: string;
  email: string;
  role: 'reader' | 'author' | 'admin';
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  authorProfile: {
    id: string;
    institution: string | null;
    orcid: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  /**
   * Helper to format the combined profile response.
   */
  private formatProfile(user: DbUser, author: DbAuthor | null): ProfileResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role as 'reader' | 'author' | 'admin',
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      authorProfile: author
        ? {
            id: author.id,
            institution: author.institution,
            orcid: author.orcid,
            createdAt: author.createdAt,
            updatedAt: author.updatedAt,
          }
        : null,
    };
  }

  /**
   * Get user profile, including author information if available.
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.profileRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, 'User profile not found', 'USER_NOT_FOUND');
    }

    const author = await this.profileRepository.findAuthorByUserId(userId);
    return this.formatProfile(user, author);
  }

  /**
   * Update user details and optionally sync/create author profile.
   */
  async updateProfile(userId: string, data: UpdateProfileInput): Promise<ProfileResponse> {
    const user = await this.profileRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, 'User profile not found', 'USER_NOT_FOUND');
    }

    const updatedUser = await this.profileRepository.updateUser(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
    });

    let author = await this.profileRepository.findAuthorByUserId(userId);

    if (user.role === 'author' || author) {
      if (author) {
        author = await this.profileRepository.updateAuthor(author.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          institution: data.institution,
          orcid: data.orcid,
        });
      } else {
        author = await this.profileRepository.createAuthor({
          userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: user.email,
          institution: data.institution,
          orcid: data.orcid,
        });
      }
    }

    return this.formatProfile(updatedUser, author);
  }
}
