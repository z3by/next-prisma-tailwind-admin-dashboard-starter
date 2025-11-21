import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { User, UserRole, UserStatus } from '@/core/domain/entities/user.entity';
import { Email } from '@/core/domain/value-objects/email';
import { Password } from '@/core/domain/value-objects/password';
import { ConflictError } from '@/core/domain/errors/domain-error';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';

/**
 * Create User Use Case
 * Handles the business logic for creating a new user
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

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

    // Create user entity
    const user = User.create({
      email,
      password,
      name: dto.name || null,
      image: null,
      role: dto.role || UserRole.USER,
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
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

