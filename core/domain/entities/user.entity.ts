import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { ValidationError, InvalidOperationError } from '../errors/domain-error';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface UserProps {
  id: string;
  email: Email;
  password: Password;
  name: string | null;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Entity
 * Represents a user in the system with all business logic
 */
export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  /**
   * Creates a new User entity
   * @param props - User properties
   * @returns User instance
   */
  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date();

    return new User({
      ...props,
      id: '', // Will be set by repository
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstitutes a User entity from database data
   * @param props - Complete user properties including ID
   * @returns User instance
   */
  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  // ============================================================================
  // Getters
  // ============================================================================

  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get name(): string | null {
    return this.props.name;
  }

  get image(): string | null {
    return this.props.image;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get emailVerified(): Date | null {
    return this.props.emailVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ============================================================================
  // Business Logic Methods
  // ============================================================================

  /**
   * Updates user profile information
   * @param name - New name
   * @param image - New image URL
   */
  updateProfile(name: string | null, image: string | null): void {
    if (name !== null && name.trim().length === 0) {
      throw new ValidationError('Name cannot be empty');
    }

    this.props.name = name;
    this.props.image = image;
    this.touch();
  }

  /**
   * Changes user password
   * @param newPassword - New password value object
   */
  changePassword(newPassword: Password): void {
    this.props.password = newPassword;
    this.touch();
  }

  /**
   * Verifies user email
   */
  verifyEmail(): void {
    if (this.props.emailVerified) {
      throw new InvalidOperationError('Email is already verified');
    }

    this.props.emailVerified = new Date();
    this.touch();
  }

  /**
   * Changes user role
   * @param role - New role
   */
  changeRole(role: UserRole): void {
    if (this.props.role === role) {
      return;
    }

    this.props.role = role;
    this.touch();
  }

  /**
   * Activates the user account
   */
  activate(): void {
    if (this.props.status === UserStatus.ACTIVE) {
      return;
    }

    this.props.status = UserStatus.ACTIVE;
    this.touch();
  }

  /**
   * Deactivates the user account
   */
  deactivate(): void {
    if (this.props.status === UserStatus.INACTIVE) {
      return;
    }

    this.props.status = UserStatus.INACTIVE;
    this.touch();
  }

  /**
   * Suspends the user account
   */
  suspend(): void {
    if (this.props.status === UserStatus.SUSPENDED) {
      return;
    }

    this.props.status = UserStatus.SUSPENDED;
    this.touch();
  }

  /**
   * Checks if user is active
   */
  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  /**
   * Checks if user is suspended
   */
  isSuspended(): boolean {
    return this.props.status === UserStatus.SUSPENDED;
  }

  /**
   * Checks if user email is verified
   */
  isEmailVerified(): boolean {
    return this.props.emailVerified !== null;
  }

  /**
   * Checks if user is admin
   */
  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN || this.props.role === UserRole.SUPER_ADMIN;
  }

  /**
   * Checks if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.props.role === UserRole.SUPER_ADMIN;
  }

  /**
   * Checks if user can perform admin actions
   */
  canPerformAdminActions(): boolean {
    return this.isActive() && this.isAdmin();
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Updates the updatedAt timestamp
   */
  private touch(): void {
    this.props.updatedAt = new Date();
  }

  // ============================================================================
  // Conversion Methods
  // ============================================================================

  /**
   * Converts entity to plain object for persistence
   */
  toPersistence(): {
    id: string;
    email: string;
    password: string;
    name: string | null;
    image: string | null;
    role: UserRole;
    status: UserStatus;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.props.id,
      email: this.props.email.getValue(),
      password: this.props.password.getValue(),
      name: this.props.name,
      image: this.props.image,
      role: this.props.role,
      status: this.props.status,
      emailVerified: this.props.emailVerified,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}

