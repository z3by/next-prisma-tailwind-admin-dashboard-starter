import { Permission } from '../entities/permission.entity';

/**
 * Permission Repository Interface
 * Defines the contract for permission data access
 */
export interface IPermissionRepository {
  /**
   * Saves a permission to the database
   * @param permission - Permission entity to save
   * @returns Promise<Permission> saved permission with ID
   */
  save(permission: Permission): Promise<Permission>;

  /**
   * Finds a permission by ID
   * @param id - Permission ID
   * @returns Promise<Permission | null> permission or null if not found
   */
  findById(id: string): Promise<Permission | null>;

  /**
   * Finds a permission by name
   * @param name - Permission name
   * @returns Promise<Permission | null> permission or null if not found
   */
  findByName(name: string): Promise<Permission | null>;

  /**
   * Finds a permission by resource and action
   * @param resource - Resource name
   * @param action - Action name
   * @returns Promise<Permission | null> permission or null if not found
   */
  findByResourceAndAction(resource: string, action: string): Promise<Permission | null>;

  /**
   * Finds all permissions with pagination
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Promise<Permission[]> array of permissions
   */
  findAll(skip?: number, take?: number): Promise<Permission[]>;

  /**
   * Finds permissions by role ID
   * @param roleId - Role ID
   * @returns Promise<Permission[]> array of permissions
   */
  findByRoleId(roleId: string): Promise<Permission[]>;

  /**
   * Finds permissions by user ID (through their roles)
   * @param userId - User ID
   * @returns Promise<Permission[]> array of permissions
   */
  findByUserId(userId: string): Promise<Permission[]>;

  /**
   * Finds permissions by resource
   * @param resource - Resource name
   * @returns Promise<Permission[]> array of permissions
   */
  findByResource(resource: string): Promise<Permission[]>;

  /**
   * Counts total number of permissions
   * @returns Promise<number> total count
   */
  count(): Promise<number>;

  /**
   * Updates a permission
   * @param permission - Permission entity with updates
   * @returns Promise<Permission> updated permission
   */
  update(permission: Permission): Promise<Permission>;

  /**
   * Deletes a permission by ID
   * @param id - Permission ID
   * @returns Promise<void>
   */
  delete(id: string): Promise<void>;

  /**
   * Checks if permission already exists
   * @param resource - Resource name
   * @param action - Action name
   * @param excludePermissionId - Permission ID to exclude from check (for updates)
   * @returns Promise<boolean> true if exists
   */
  exists(resource: string, action: string, excludePermissionId?: string): Promise<boolean>;

  /**
   * Assigns a permission to a role
   * @param roleId - Role ID
   * @param permissionId - Permission ID
   * @returns Promise<void>
   */
  assignToRole(roleId: string, permissionId: string): Promise<void>;

  /**
   * Removes a permission from a role
   * @param roleId - Role ID
   * @param permissionId - Permission ID
   * @returns Promise<void>
   */
  removeFromRole(roleId: string, permissionId: string): Promise<void>;

  /**
   * Replaces all permissions for a role
   * @param roleId - Role ID
   * @param permissionIds - Array of permission IDs
   * @returns Promise<void>
   */
  setRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
}

