import { Role } from '../entities/role.entity';

/**
 * Role Repository Interface
 * Defines the contract for role data access
 */
export interface IRoleRepository {
  /**
   * Saves a role to the database
   * @param role - Role entity to save
   * @returns Promise<Role> saved role with ID
   */
  save(role: Role): Promise<Role>;

  /**
   * Finds a role by ID
   * @param id - Role ID
   * @returns Promise<Role | null> role or null if not found
   */
  findById(id: string): Promise<Role | null>;

  /**
   * Finds a role by name
   * @param name - Role name
   * @returns Promise<Role | null> role or null if not found
   */
  findByName(name: string): Promise<Role | null>;

  /**
   * Finds all roles with pagination
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Promise<Role[]> array of roles
   */
  findAll(skip?: number, take?: number): Promise<Role[]>;

  /**
   * Finds roles by user ID
   * @param userId - User ID
   * @returns Promise<Role[]> array of roles
   */
  findByUserId(userId: string): Promise<Role[]>;

  /**
   * Counts total number of roles
   * @returns Promise<number> total count
   */
  count(): Promise<number>;

  /**
   * Updates a role
   * @param role - Role entity with updates
   * @returns Promise<Role> updated role
   */
  update(role: Role): Promise<Role>;

  /**
   * Deletes a role by ID
   * @param id - Role ID
   * @returns Promise<void>
   */
  delete(id: string): Promise<void>;

  /**
   * Checks if role name already exists
   * @param name - Role name to check
   * @param excludeRoleId - Role ID to exclude from check (for updates)
   * @returns Promise<boolean> true if exists
   */
  nameExists(name: string, excludeRoleId?: string): Promise<boolean>;

  /**
   * Assigns a role to a user
   * @param userId - User ID
   * @param roleId - Role ID
   * @returns Promise<void>
   */
  assignToUser(userId: string, roleId: string): Promise<void>;

  /**
   * Removes a role from a user
   * @param userId - User ID
   * @param roleId - Role ID
   * @returns Promise<void>
   */
  removeFromUser(userId: string, roleId: string): Promise<void>;

  /**
   * Replaces all roles for a user
   * @param userId - User ID
   * @param roleIds - Array of role IDs
   * @returns Promise<void>
   */
  setUserRoles(userId: string, roleIds: string[]): Promise<void>;
}

