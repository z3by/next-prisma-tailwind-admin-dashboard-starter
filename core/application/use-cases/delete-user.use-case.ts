import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { NotFoundError } from '@/core/domain/errors/domain-error';

/**
 * Delete User Use Case
 * Deletes a user from the system
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the delete user use case
   * @param userId - User ID to delete
   * @returns Promise<void>
   * @throws NotFoundError if user not found
   */
  async execute(userId: string): Promise<void> {
    // Verify user exists
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    // Delete user
    await this.userRepository.delete(userId);
  }
}

