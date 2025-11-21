import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { IRoleRepository } from '@/core/domain/repositories/role.repository.interface';
import { User } from '@/core/domain/entities/user.entity';
import { NotFoundError } from '@/core/domain/errors/domain-error';
import { UpdateUserDto, UserResponseDto } from '../dtos/user.dto';

/**
 * Update User Use Case
 * Updates user information
 */
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  /**
   * Executes the update user use case
   * @param userId - User ID
   * @param dto - Update data
   * @returns Promise<UserResponseDto> updated user
   * @throws NotFoundError if user not found
   */
  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    // Find user
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    // Update profile if name or image provided
    if (dto.name !== undefined || dto.image !== undefined) {
      user.updateProfile(dto.name ?? user.name, dto.image ?? user.image);
    }

    // Update roles if provided
    if (dto.roleIds !== undefined) {
      const roles = await Promise.all(
        dto.roleIds.map(async (roleId) => {
          const role = await this.roleRepository.findById(roleId);
          if (!role) {
            throw new NotFoundError('Role', roleId);
          }
          return role;
        })
      );
      user.setRoles(roles);

      // Update roles in database
      await this.roleRepository.setUserRoles(userId, dto.roleIds);
    }

    // Update status if provided
    if (dto.status !== undefined) {
      if (dto.status === 'ACTIVE') {
        user.activate();
      } else if (dto.status === 'INACTIVE') {
        user.deactivate();
      } else if (dto.status === 'SUSPENDED') {
        user.suspend();
      }
    }

    // Save changes
    const updatedUser = await this.userRepository.update(user);

    return this.toDto(updatedUser);
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
