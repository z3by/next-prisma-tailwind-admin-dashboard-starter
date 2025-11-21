import { UserStatus } from '@/core/domain/entities/user.entity';

/**
 * Create User DTO
 * Data Transfer Object for creating a new user
 */
export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  roleIds?: string[];
}

/**
 * Update User DTO
 * Data Transfer Object for updating user information
 */
export interface UpdateUserDto {
  name?: string | null;
  image?: string | null;
  roleIds?: string[];
  status?: UserStatus;
}

/**
 * User Response DTO
 * Data Transfer Object for user responses (excludes sensitive data)
 */
export interface UserResponseDto {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[]; // Array of role names
  permissions: string[]; // Array of permission strings
  status: UserStatus;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Change Password DTO
 */
export interface ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

/**
 * List Users Query DTO
 */
export interface ListUsersQueryDto {
  page?: number;
  limit?: number;
}

/**
 * List Users Response DTO
 */
export interface ListUsersResponseDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

