import { User } from '@/core/domain/entities/user.entity';
import { UnauthorizedError } from '@/core/domain/errors/domain-error';

/**
 * Authorization Guards and Utilities
 * Helper functions for checking permissions and roles
 */

// ============================================================================
// Permission Guards
// ============================================================================

/**
 * Checks if a user has a specific permission
 * @param user - User entity
 * @param permission - Permission string (format: resource:action)
 * @throws UnauthorizedError if user doesn't have permission
 */
export function requirePermission(user: User | null, permission: string): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.hasPermission(permission)) {
    throw new UnauthorizedError(`Permission denied: ${permission}`);
  }
}

/**
 * Checks if a user has any of the specified permissions
 * @param user - User entity
 * @param permissions - Array of permission strings
 * @throws UnauthorizedError if user doesn't have any permission
 */
export function requireAnyPermission(user: User | null, permissions: string[]): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.hasAnyPermission(permissions)) {
    throw new UnauthorizedError(`Permission denied: one of ${permissions.join(', ')}`);
  }
}

/**
 * Checks if a user has all of the specified permissions
 * @param user - User entity
 * @param permissions - Array of permission strings
 * @throws UnauthorizedError if user doesn't have all permissions
 */
export function requireAllPermissions(user: User | null, permissions: string[]): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.hasAllPermissions(permissions)) {
    throw new UnauthorizedError(`Permission denied: all of ${permissions.join(', ')}`);
  }
}

// ============================================================================
// Role Guards
// ============================================================================

/**
 * Checks if a user has a specific role
 * @param user - User entity
 * @param role - Role name
 * @throws UnauthorizedError if user doesn't have role
 */
export function requireRole(user: User | null, role: string): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.hasRole(role)) {
    throw new UnauthorizedError(`Role required: ${role}`);
  }
}

/**
 * Checks if a user has any of the specified roles
 * @param user - User entity
 * @param roles - Array of role names
 * @throws UnauthorizedError if user doesn't have any role
 */
export function requireAnyRole(user: User | null, roles: string[]): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.hasAnyRole(roles)) {
    throw new UnauthorizedError(`Role required: one of ${roles.join(', ')}`);
  }
}

/**
 * Checks if a user has all of the specified roles
 * @param user - User entity
 * @param roles - Array of role names
 * @throws UnauthorizedError if user doesn't have all roles
 */
export function requireAllRoles(user: User | null, roles: string[]): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.hasAllRoles(roles)) {
    throw new UnauthorizedError(`Roles required: all of ${roles.join(', ')}`);
  }
}

// ============================================================================
// Common Guards
// ============================================================================

/**
 * Checks if a user is authenticated and active
 * @param user - User entity
 * @throws UnauthorizedError if user is not authenticated or active
 */
export function requireAuthenticated(user: User | null): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }
}

/**
 * Checks if a user is an admin
 * @param user - User entity
 * @throws UnauthorizedError if user is not an admin
 */
export function requireAdmin(user: User | null): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.isAdmin()) {
    throw new UnauthorizedError('Admin access required');
  }
}

/**
 * Checks if a user is a super admin
 * @param user - User entity
 * @throws UnauthorizedError if user is not a super admin
 */
export function requireSuperAdmin(user: User | null): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  if (!user.isSuperAdmin()) {
    throw new UnauthorizedError('Super admin access required');
  }
}

// ============================================================================
// Permission Checking Utilities
// ============================================================================

/**
 * Checks if a user has a permission (returns boolean instead of throwing)
 * @param user - User entity
 * @param permission - Permission string
 * @returns true if user has permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.isActive()) {
    return false;
  }

  return user.hasPermission(permission);
}

/**
 * Checks if a user has any of the specified permissions
 * @param user - User entity
 * @param permissions - Array of permission strings
 * @returns true if user has at least one permission
 */
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user || !user.isActive()) {
    return false;
  }

  return user.hasAnyPermission(permissions);
}

/**
 * Checks if a user has all of the specified permissions
 * @param user - User entity
 * @param permissions - Array of permission strings
 * @returns true if user has all permissions
 */
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  if (!user || !user.isActive()) {
    return false;
  }

  return user.hasAllPermissions(permissions);
}

/**
 * Checks if a user has a role (returns boolean instead of throwing)
 * @param user - User entity
 * @param role - Role name
 * @returns true if user has role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user || !user.isActive()) {
    return false;
  }

  return user.hasRole(role);
}

/**
 * Checks if a user has any of the specified roles
 * @param user - User entity
 * @param roles - Array of role names
 * @returns true if user has at least one role
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user || !user.isActive()) {
    return false;
  }

  return user.hasAnyRole(roles);
}

/**
 * Checks if a user has all of the specified roles
 * @param user - User entity
 * @param roles - Array of role names
 * @returns true if user has all roles
 */
export function hasAllRoles(user: User | null, roles: string[]): boolean {
  if (!user || !user.isActive()) {
    return false;
  }

  return user.hasAllRoles(roles);
}

// ============================================================================
// Resource Ownership Guards
// ============================================================================

/**
 * Checks if a user can access a resource based on ownership or permissions
 * @param user - User entity
 * @param resourceOwnerId - ID of the resource owner
 * @param permission - Permission required if user is not the owner
 * @throws UnauthorizedError if user cannot access the resource
 */
export function requireOwnershipOrPermission(
  user: User | null,
  resourceOwnerId: string,
  permission: string
): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  // User owns the resource
  if (user.id === resourceOwnerId) {
    return;
  }

  // User has the required permission
  if (user.hasPermission(permission)) {
    return;
  }

  throw new UnauthorizedError('Access denied to this resource');
}

/**
 * Checks if a user is the owner of a resource or is an admin
 * @param user - User entity
 * @param resourceOwnerId - ID of the resource owner
 * @throws UnauthorizedError if user is not owner or admin
 */
export function requireOwnershipOrAdmin(user: User | null, resourceOwnerId: string): void {
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (!user.isActive()) {
    throw new UnauthorizedError('Account is not active');
  }

  // User owns the resource
  if (user.id === resourceOwnerId) {
    return;
  }

  // User is admin
  if (user.isAdmin()) {
    return;
  }

  throw new UnauthorizedError('Access denied to this resource');
}
