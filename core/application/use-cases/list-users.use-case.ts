import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { User } from '@/core/domain/entities/user.entity';
import { ListUsersQueryDto, ListUsersResponseDto, UserResponseDto } from '../dtos/user.dto';

/**
 * List Users Use Case
 * Retrieves a paginated list of users
 */
export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Executes the list users use case
   * @param query - Pagination parameters
   * @returns Promise<ListUsersResponseDto> paginated users
   */
  async execute(query: ListUsersQueryDto = {}): Promise<ListUsersResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Fetch users and total count in parallel
    const [users, total] = await Promise.all([
      this.userRepository.findAll(skip, limit),
      this.userRepository.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map((user) => this.toDto(user)),
      total,
      page,
      limit,
      totalPages,
    };
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

