import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { IRoleRepository } from '@/core/domain/repositories/role.repository.interface';
import { User, UserStatus } from '@/core/domain/entities/user.entity';
import { Email } from '@/core/domain/value-objects/email';
import { Password } from '@/core/domain/value-objects/password';
import { ConflictError, NotFoundError } from '@/core/domain/errors/domain-error';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { SYSTEM_ROLES } from '@/lib/constants/rbac.constants';

/**
 * Create User Use Case
 * Handles the business logic for creating a new user
 */
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  /**
   * Executes the create user use case
   * @param dto - User creation data
   * @returns Promise<UserResponseDto> created user
   * @throws ConflictError if email already exists
   * @throws ValidationError if data is invalid
   */
  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Validate and create value objects
    const email = Email.create(dto.email);
    const password = await Password.create(dto.password);

    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new ConflictError('Email already exists');
    }

    // Get roles (default to USER role if not specified)
    const roles: import('@/core/domain/entities/role.entity').Role[] = [];
    if (dto.roleIds && dto.roleIds.length > 0) {
      const fetchedRoles = await Promise.all(
        dto.roleIds.map(async (roleId) => {
          const role = await this.roleRepository.findById(roleId);
          if (!role) {
            throw new NotFoundError('Role', roleId);
          }
          return role;
        })
      );
      roles.push(...fetchedRoles);
    } else {
      // Assign default USER role
      const defaultRole = await this.roleRepository.findByName(SYSTEM_ROLES.USER);
      if (defaultRole) {
        roles.push(defaultRole);
      }
    }

    // Create user entity
    const user = User.create({
      email,
      password,
      name: dto.name || null,
      image: null,
      roles,
      status: UserStatus.ACTIVE,
      emailVerified: null,
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Return DTO
    return this.toDto(savedUser);
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
