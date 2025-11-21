/**
 * RBAC Constants
 * Centralized location for all RBAC-related constants
 */

// ============================================================================
// System Roles
// ============================================================================

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

// ============================================================================
// Resources
// ============================================================================

export const RESOURCES = {
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  POSTS: 'posts',
  COMMENTS: 'comments',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
  REPORTS: 'reports',
} as const;

// ============================================================================
// Actions
// ============================================================================

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // Full control
  LIST: 'list',
  VIEW: 'view',
  EXPORT: 'export',
  IMPORT: 'import',
} as const;

// ============================================================================
// Pre-defined Permissions
// ============================================================================

export const PERMISSIONS = {
  // User Management
  USERS_CREATE: `${RESOURCES.USERS}:${ACTIONS.CREATE}`,
  USERS_READ: `${RESOURCES.USERS}:${ACTIONS.READ}`,
  USERS_UPDATE: `${RESOURCES.USERS}:${ACTIONS.UPDATE}`,
  USERS_DELETE: `${RESOURCES.USERS}:${ACTIONS.DELETE}`,
  USERS_MANAGE: `${RESOURCES.USERS}:${ACTIONS.MANAGE}`,
  USERS_LIST: `${RESOURCES.USERS}:${ACTIONS.LIST}`,
  USERS_EXPORT: `${RESOURCES.USERS}:${ACTIONS.EXPORT}`,

  // Role Management
  ROLES_CREATE: `${RESOURCES.ROLES}:${ACTIONS.CREATE}`,
  ROLES_READ: `${RESOURCES.ROLES}:${ACTIONS.READ}`,
  ROLES_UPDATE: `${RESOURCES.ROLES}:${ACTIONS.UPDATE}`,
  ROLES_DELETE: `${RESOURCES.ROLES}:${ACTIONS.DELETE}`,
  ROLES_MANAGE: `${RESOURCES.ROLES}:${ACTIONS.MANAGE}`,
  ROLES_LIST: `${RESOURCES.ROLES}:${ACTIONS.LIST}`,

  // Permission Management
  PERMISSIONS_CREATE: `${RESOURCES.PERMISSIONS}:${ACTIONS.CREATE}`,
  PERMISSIONS_READ: `${RESOURCES.PERMISSIONS}:${ACTIONS.READ}`,
  PERMISSIONS_UPDATE: `${RESOURCES.PERMISSIONS}:${ACTIONS.UPDATE}`,
  PERMISSIONS_DELETE: `${RESOURCES.PERMISSIONS}:${ACTIONS.DELETE}`,
  PERMISSIONS_MANAGE: `${RESOURCES.PERMISSIONS}:${ACTIONS.MANAGE}`,
  PERMISSIONS_LIST: `${RESOURCES.PERMISSIONS}:${ACTIONS.LIST}`,

  // Content Management
  POSTS_CREATE: `${RESOURCES.POSTS}:${ACTIONS.CREATE}`,
  POSTS_READ: `${RESOURCES.POSTS}:${ACTIONS.READ}`,
  POSTS_UPDATE: `${RESOURCES.POSTS}:${ACTIONS.UPDATE}`,
  POSTS_DELETE: `${RESOURCES.POSTS}:${ACTIONS.DELETE}`,
  POSTS_MANAGE: `${RESOURCES.POSTS}:${ACTIONS.MANAGE}`,
  POSTS_LIST: `${RESOURCES.POSTS}:${ACTIONS.LIST}`,

  // Comments
  COMMENTS_CREATE: `${RESOURCES.COMMENTS}:${ACTIONS.CREATE}`,
  COMMENTS_READ: `${RESOURCES.COMMENTS}:${ACTIONS.READ}`,
  COMMENTS_UPDATE: `${RESOURCES.COMMENTS}:${ACTIONS.UPDATE}`,
  COMMENTS_DELETE: `${RESOURCES.COMMENTS}:${ACTIONS.DELETE}`,
  COMMENTS_MANAGE: `${RESOURCES.COMMENTS}:${ACTIONS.MANAGE}`,

  // Settings
  SETTINGS_READ: `${RESOURCES.SETTINGS}:${ACTIONS.READ}`,
  SETTINGS_UPDATE: `${RESOURCES.SETTINGS}:${ACTIONS.UPDATE}`,
  SETTINGS_MANAGE: `${RESOURCES.SETTINGS}:${ACTIONS.MANAGE}`,

  // Analytics
  ANALYTICS_VIEW: `${RESOURCES.ANALYTICS}:${ACTIONS.VIEW}`,
  ANALYTICS_EXPORT: `${RESOURCES.ANALYTICS}:${ACTIONS.EXPORT}`,

  // Reports
  REPORTS_CREATE: `${RESOURCES.REPORTS}:${ACTIONS.CREATE}`,
  REPORTS_VIEW: `${RESOURCES.REPORTS}:${ACTIONS.VIEW}`,
  REPORTS_EXPORT: `${RESOURCES.REPORTS}:${ACTIONS.EXPORT}`,
} as const;

// ============================================================================
// Default Role Permissions
// ============================================================================

export const DEFAULT_ROLE_PERMISSIONS = {
  [SYSTEM_ROLES.SUPER_ADMIN]: [
    // Full access to everything
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.PERMISSIONS_MANAGE,
    PERMISSIONS.POSTS_MANAGE,
    PERMISSIONS.COMMENTS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  [SYSTEM_ROLES.ADMIN]: [
    // User management
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_LIST,
    PERMISSIONS.USERS_EXPORT,

    // Limited role management
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.ROLES_LIST,

    // Content management
    PERMISSIONS.POSTS_MANAGE,
    PERMISSIONS.COMMENTS_MANAGE,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
  [SYSTEM_ROLES.USER]: [
    // Own profile
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_UPDATE, // Own profile only

    // Content creation
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_READ,
  ],
} as const;

// ============================================================================
// Permission Descriptions
// ============================================================================

export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  // Users
  [PERMISSIONS.USERS_CREATE]: 'Create new users',
  [PERMISSIONS.USERS_READ]: 'View user details',
  [PERMISSIONS.USERS_UPDATE]: 'Update user information',
  [PERMISSIONS.USERS_DELETE]: 'Delete users',
  [PERMISSIONS.USERS_MANAGE]: 'Full control over user management',
  [PERMISSIONS.USERS_LIST]: 'View list of users',
  [PERMISSIONS.USERS_EXPORT]: 'Export user data',

  // Roles
  [PERMISSIONS.ROLES_CREATE]: 'Create new roles',
  [PERMISSIONS.ROLES_READ]: 'View role details',
  [PERMISSIONS.ROLES_UPDATE]: 'Update role information',
  [PERMISSIONS.ROLES_DELETE]: 'Delete roles',
  [PERMISSIONS.ROLES_MANAGE]: 'Full control over role management',
  [PERMISSIONS.ROLES_LIST]: 'View list of roles',

  // Permissions
  [PERMISSIONS.PERMISSIONS_CREATE]: 'Create new permissions',
  [PERMISSIONS.PERMISSIONS_READ]: 'View permission details',
  [PERMISSIONS.PERMISSIONS_UPDATE]: 'Update permission information',
  [PERMISSIONS.PERMISSIONS_DELETE]: 'Delete permissions',
  [PERMISSIONS.PERMISSIONS_MANAGE]: 'Full control over permission management',
  [PERMISSIONS.PERMISSIONS_LIST]: 'View list of permissions',

  // Posts
  [PERMISSIONS.POSTS_CREATE]: 'Create new posts',
  [PERMISSIONS.POSTS_READ]: 'View posts',
  [PERMISSIONS.POSTS_UPDATE]: 'Update posts',
  [PERMISSIONS.POSTS_DELETE]: 'Delete posts',
  [PERMISSIONS.POSTS_MANAGE]: 'Full control over post management',
  [PERMISSIONS.POSTS_LIST]: 'View list of posts',

  // Comments
  [PERMISSIONS.COMMENTS_CREATE]: 'Create comments',
  [PERMISSIONS.COMMENTS_READ]: 'View comments',
  [PERMISSIONS.COMMENTS_UPDATE]: 'Update comments',
  [PERMISSIONS.COMMENTS_DELETE]: 'Delete comments',
  [PERMISSIONS.COMMENTS_MANAGE]: 'Full control over comment management',

  // Settings
  [PERMISSIONS.SETTINGS_READ]: 'View settings',
  [PERMISSIONS.SETTINGS_UPDATE]: 'Update settings',
  [PERMISSIONS.SETTINGS_MANAGE]: 'Full control over settings',

  // Analytics
  [PERMISSIONS.ANALYTICS_VIEW]: 'View analytics dashboard',
  [PERMISSIONS.ANALYTICS_EXPORT]: 'Export analytics data',

  // Reports
  [PERMISSIONS.REPORTS_CREATE]: 'Create reports',
  [PERMISSIONS.REPORTS_VIEW]: 'View reports',
  [PERMISSIONS.REPORTS_EXPORT]: 'Export reports',
};

// ============================================================================
// RBAC Configuration
// ============================================================================

export const RBAC_CONFIG = {
  // Allow system roles to be modified
  ALLOW_SYSTEM_ROLE_MODIFICATION: false,

  // Require at least one role per user
  REQUIRE_USER_ROLE: true,

  // Default role for new users
  DEFAULT_USER_ROLE: SYSTEM_ROLES.USER,

  // Maximum roles per user
  MAX_ROLES_PER_USER: 10,

  // Maximum permissions per role
  MAX_PERMISSIONS_PER_ROLE: 100,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type PermissionString = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

