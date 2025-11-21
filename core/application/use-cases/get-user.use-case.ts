import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { User } from '@/core/domain/entities/user.entity';
import { NotFoundError } from '@/core/domain/errors/domain-error';
import { UserResponseDto } from '../dtos/user.dto';

/**
 * Get User Use Case
 * Retrieves a single user by ID
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the get user use case
   * @param userId - User ID
   * @returns Promise<UserResponseDto> user data
   * @throws NotFoundError if user not found
   */
  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    return this.toDto(user);
  }

  /**
   * Converts User entity to UserResponseDto
   */
  private toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name,
      image: user.image,
      roles: user.getRoleNames(),
      permissions: user.getAllPermissions(),
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

