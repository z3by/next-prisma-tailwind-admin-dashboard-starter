import { ValidationError } from '../errors/domain-error';

export interface PermissionProps {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Permission Entity
 * Represents a specific permission in the system
 * Format: resource:action (e.g., "users:create", "posts:read")
 */
export class Permission {
  private props: PermissionProps;

  private constructor(props: PermissionProps) {
    this.props = props;
  }

  /**
   * Creates a new Permission entity
   * @param props - Permission properties
   * @returns Permission instance
   */
  static create(
    props: Omit<PermissionProps, 'id' | 'createdAt' | 'updatedAt'>
  ): Permission {
    this.validate(props);

    const now = new Date();

    return new Permission({
      ...props,
      id: '',
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstitutes a Permission entity from database data
   * @param props - Complete permission properties including ID
   * @returns Permission instance
   */
  static fromPersistence(props: PermissionProps): Permission {
    return new Permission(props);
  }

  /**
   * Validates permission properties
   */
  private static validate(
    props: Omit<PermissionProps, 'id' | 'createdAt' | 'updatedAt'>
  ): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('Permission name is required');
    }

    if (!props.resource || props.resource.trim().length === 0) {
      throw new ValidationError('Permission resource is required');
    }

    if (!props.action || props.action.trim().length === 0) {
      throw new ValidationError('Permission action is required');
    }

    // Validate format: should not contain special characters except underscore and hyphen
    const validPattern = /^[a-z0-9_-]+$/i;
    if (!validPattern.test(props.resource)) {
      throw new ValidationError('Resource contains invalid characters');
    }

    if (!validPattern.test(props.action)) {
      throw new ValidationError('Action contains invalid characters');
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

  get resource(): string {
    return this.props.resource;
  }

  get action(): string {
    return this.props.action;
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
   * Updates permission details
   * @param description - New description
   */
  updateDescription(description: string | null): void {
    this.props.description = description;
    this.touch();
  }

  /**
   * Gets the permission string in format resource:action
   */
  getPermissionString(): string {
    return `${this.props.resource}:${this.props.action}`;
  }

  /**
   * Checks if this permission matches a given resource and action
   */
  matches(resource: string, action: string): boolean {
    return this.props.resource === resource && this.props.action === action;
  }

  /**
   * Checks if this permission matches a permission string
   */
  matchesString(permissionString: string): boolean {
    return this.getPermissionString() === permissionString;
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
    resource: string;
    action: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      resource: this.props.resource,
      action: this.props.action,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}

