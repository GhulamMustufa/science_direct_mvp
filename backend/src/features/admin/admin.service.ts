import { AdminRepository, DbUser } from './admin.repository.js';
import { AppError } from '../../middleware/error.js';

export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  /**
   * Fetch paginated list of active users.
   */
  async getUsers(
    limit: number,
    offset: number
  ): Promise<{ users: Omit<DbUser, 'passwordHash'>[]; total: number }> {
    return this.adminRepository.findUsers(limit, offset);
  }

  /**
   * Change user access role. Synchronizes author profile if role is 'author'.
   */
  async changeUserRole(
    id: string,
    role: 'reader' | 'author' | 'admin'
  ): Promise<Omit<DbUser, 'passwordHash'>> {
    const user = await this.adminRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const updatedUser = await this.adminRepository.updateUserRole(id, role);

    if (role === 'author') {
      const author = await this.adminRepository.findAuthorByUserId(id);
      if (!author) {
        await this.adminRepository.createAuthor({
          userId: id,
          firstName: user.firstName || 'Author',
          lastName: user.lastName || 'Profile',
          email: user.email,
        });
      }
    }

    return updatedUser;
  }

  /**
   * Update user details.
   */
  async updateUser(
    id: string,
    data: { firstName?: string; lastName?: string; role?: 'reader' | 'author' | 'admin' }
  ): Promise<Omit<DbUser, 'passwordHash'>> {
    const user = await this.adminRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const updatedUser = await this.adminRepository.updateUser(id, data);

    if (data.role === 'author') {
      const author = await this.adminRepository.findAuthorByUserId(id);
      if (!author) {
        await this.adminRepository.createAuthor({
          userId: id,
          firstName: updatedUser.firstName || 'Author',
          lastName: updatedUser.lastName || 'Profile',
          email: updatedUser.email,
        });
      }
    }

    return updatedUser;
  }

  /**
   * Soft delete (block) a user.
   */
  async blockUser(id: string): Promise<void> {
    const user = await this.adminRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    await this.adminRepository.blockUser(id);
  }
}
