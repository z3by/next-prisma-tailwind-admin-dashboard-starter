import { Permission } from './permission.entity';
import { ValidationError, InvalidOperationError } from '../errors/domain-error';

export interface RoleProps {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role Entity
 * Represents a role in the system with associated permissions
 */
export class Role {
  private props: RoleProps;

  private constructor(props: RoleProps) {
    this.props = props;
  }

  /**
   * Creates a new Role entity
   * @param props - Role properties
   * @returns Role instance
   */
  static create(
    props: Omit<RoleProps, 'id' | 'createdAt' | 'updatedAt' | 'permissions'> & {
      permissions?: Permission[];
    }
  ): Role {
    this.validate(props);

    const now = new Date();

    return new Role({
      ...props,
      permissions: props.permissions || [],
      id: '',
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstitutes a Role entity from database data
   * @param props - Complete role properties including ID
   * @returns Role instance
   */
  static fromPersistence(props: RoleProps): Role {
    return new Role(props);
  }

  /**
   * Validates role properties
   */
  private static validate(
    props: Omit<RoleProps, 'id' | 'createdAt' | 'updatedAt' | 'permissions'>
  ): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('Role name is required');
    }

    if (props.name.length > 50) {
      throw new ValidationError('Role name must be less than 50 characters');
    }

    // Validate format: should be alphanumeric with underscores
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(props.name)) {
      throw new ValidationError('Role name contains invalid characters');
    }
  }

  // ============================================================================
  // Getters
  // ============================================================================

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isSystem(): boolean {
    return this.props.isSystem;
  }

  get permissions(): Permission[] {
    return [...this.props.permissions]; // Return copy to prevent external modification
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
   * Updates role details
   * @param name - New role name
   * @param description - New description
   */
  updateDetails(name: string, description: string | null): void {
    if (this.props.isSystem) {
      throw new InvalidOperationError('Cannot modify system roles');
    }

    // Validate new name
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Role name is required');
    }

    this.props.name = name;
    this.props.description = description;
    this.touch();
  }

  /**
   * Adds a permission to the role
   * @param permission - Permission to add
   */
  addPermission(permission: Permission): void {
    if (this.props.isSystem) {
      throw new InvalidOperationError('Cannot modify permissions of system roles');
    }

    // Check if permission already exists
    if (this.hasPermission(permission.getPermissionString())) {
      return; // Already has this permission
    }

    this.props.permissions.push(permission);
    this.touch();
  }

  /**
   * Adds multiple permissions to the role
   * @param permissions - Array of permissions to add
   */
  addPermissions(permissions: Permission[]): void {
    permissions.forEach((permission) => this.addPermission(permission));
  }

  /**
   * Removes a permission from the role
   * @param permissionId - ID of the permission to remove
   */
  removePermission(permissionId: string): void {
    if (this.props.isSystem) {
      throw new InvalidOperationError('Cannot modify permissions of system roles');
    }

    this.props.permissions = this.props.permissions.filter((p) => p.id !== permissionId);
    this.touch();
  }

  /**
   * Replaces all permissions with new set
   * @param permissions - New set of permissions
   */
  setPermissions(permissions: Permission[]): void {
    if (this.props.isSystem) {
      throw new InvalidOperationError('Cannot modify permissions of system roles');
    }

    this.props.permissions = [...permissions];
    this.touch();
  }

  /**
   * Checks if role has a specific permission
   * @param permissionString - Permission in format "resource:action"
   * @returns true if role has the permission
   */
  hasPermission(permissionString: string): boolean {
    return this.props.permissions.some((p) => p.matchesString(permissionString));
  }

  /**
   * Checks if role has any of the specified permissions
   * @param permissionStrings - Array of permission strings
   * @returns true if role has at least one permission
   */
  hasAnyPermission(permissionStrings: string[]): boolean {
    return permissionStrings.some((ps) => this.hasPermission(ps));
  }

  /**
   * Checks if role has all of the specified permissions
   * @param permissionStrings - Array of permission strings
   * @returns true if role has all permissions
   */
  hasAllPermissions(permissionStrings: string[]): boolean {
    return permissionStrings.every((ps) => this.hasPermission(ps));
  }

  /**
   * Checks if role has permission for a specific resource and action
   * @param resource - Resource name
   * @param action - Action name
   * @returns true if role has the permission
   */
  hasResourcePermission(resource: string, action: string): boolean {
    return this.hasPermission(`${resource}:${action}`);
  }

  /**
   * Gets all permission strings for this role
   * @returns Array of permission strings
   */
  getPermissionStrings(): string[] {
    return this.props.permissions.map((p) => p.getPermissionString());
  }

  /**
   * Gets permissions grouped by resource
   */
  getPermissionsByResource(): Map<string, string[]> {
    const grouped = new Map<string, string[]>();

    this.props.permissions.forEach((permission) => {
      const resource = permission.resource;
      if (!grouped.has(resource)) {
        grouped.set(resource, []);
      }
      grouped.get(resource)!.push(permission.action);
    });

    return grouped;
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
    name: string;
    description: string | null;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      isSystem: this.props.isSystem,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}

