import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Role } from './role.entity';
import { ValidationError, InvalidOperationError } from '../errors/domain-error';

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
  roles: Role[];
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
  static create(
    props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'roles'> & { roles?: Role[] }
  ): User {
    const now = new Date();

    return new User({
      ...props,
      roles: props.roles || [],
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

  get roles(): Role[] {
    return [...this.props.roles]; // Return copy to prevent external modification
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
   * Assigns a role to the user
   * @param role - Role to assign
   */
  assignRole(role: Role): void {
    // Check if user already has this role
    if (this.hasRole(role.name)) {
      return;
    }

    this.props.roles.push(role);
    this.touch();
  }

  /**
   * Assigns multiple roles to the user
   * @param roles - Roles to assign
   */
  assignRoles(roles: Role[]): void {
    roles.forEach((role) => this.assignRole(role));
  }

  /**
   * Removes a role from the user
   * @param roleId - Role ID to remove
   */
  removeRole(roleId: string): void {
    this.props.roles = this.props.roles.filter((r) => r.id !== roleId);
    this.touch();
  }

  /**
   * Replaces all roles with new set
   * @param roles - New set of roles
   */
  setRoles(roles: Role[]): void {
    this.props.roles = [...roles];
    this.touch();
  }

  /**
   * Checks if user has a specific role
   * @param roleName - Role name
   * @returns true if user has the role
   */
  hasRole(roleName: string): boolean {
    return this.props.roles.some((r) => r.name === roleName);
  }

  /**
   * Checks if user has any of the specified roles
   * @param roleNames - Array of role names
   * @returns true if user has at least one role
   */
  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some((rn) => this.hasRole(rn));
  }

  /**
   * Checks if user has all of the specified roles
   * @param roleNames - Array of role names
   * @returns true if user has all roles
   */
  hasAllRoles(roleNames: string[]): boolean {
    return roleNames.every((rn) => this.hasRole(rn));
  }

  /**
   * Checks if user has a specific permission
   * @param permissionString - Permission in format "resource:action"
   * @returns true if user has the permission through any of their roles
   */
  hasPermission(permissionString: string): boolean {
    return this.props.roles.some((role) => role.hasPermission(permissionString));
  }

  /**
   * Checks if user has any of the specified permissions
   * @param permissionStrings - Array of permission strings
   * @returns true if user has at least one permission
   */
  hasAnyPermission(permissionStrings: string[]): boolean {
    return permissionStrings.some((ps) => this.hasPermission(ps));
  }

  /**
   * Checks if user has all of the specified permissions
   * @param permissionStrings - Array of permission strings
   * @returns true if user has all permissions
   */
  hasAllPermissions(permissionStrings: string[]): boolean {
    return permissionStrings.every((ps) => this.hasPermission(ps));
  }

  /**
   * Gets all permissions for this user from all their roles
   * @returns Array of unique permission strings
   */
  getAllPermissions(): string[] {
    const permissions = new Set<string>();

    this.props.roles.forEach((role) => {
      role.getPermissionStrings().forEach((p) => permissions.add(p));
    });

    return Array.from(permissions);
  }

  /**
   * Gets all role names for this user
   * @returns Array of role names
   */
  getRoleNames(): string[] {
    return this.props.roles.map((r) => r.name);
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
   * Checks if user is admin (has ADMIN or SUPER_ADMIN role)
   */
  isAdmin(): boolean {
    return this.hasAnyRole(['ADMIN', 'SUPER_ADMIN']);
  }

  /**
   * Checks if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
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
      status: this.props.status,
      emailVerified: this.props.emailVerified,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}

