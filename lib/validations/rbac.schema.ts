import { z } from 'zod';

/**
 * RBAC Validation Schemas
 * Zod schemas for validating RBAC-related input
 */

// ============================================================================
// Permission Schemas
// ============================================================================

export const permissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required').max(100, 'Permission name too long'),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  resource: z
    .string()
    .min(1, 'Resource is required')
    .max(50, 'Resource name too long')
    .regex(/^[a-z0-9_-]+$/i, 'Resource contains invalid characters'),
  action: z
    .string()
    .min(1, 'Action is required')
    .max(50, 'Action name too long')
    .regex(/^[a-z0-9_-]+$/i, 'Action contains invalid characters'),
});

export const createPermissionSchema = permissionSchema;

export const updatePermissionSchema = z.object({
  description: z.string().max(500, 'Description too long').optional().nullable(),
});

export const permissionStringSchema = z
  .string()
  .min(1, 'Permission is required')
  .regex(/^[a-z0-9_-]+:[a-z0-9_-]+$/i, 'Invalid permission format (should be resource:action)');

// ============================================================================
// Role Schemas
// ============================================================================

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(50, 'Role name too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Role name contains invalid characters'),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  isSystem: z.boolean().optional().default(false),
  permissionIds: z.array(z.string().cuid('Invalid permission ID')).optional(),
});

export const createRoleSchema = roleSchema;

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(50, 'Role name too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Role name contains invalid characters')
    .optional(),
  description: z.string().max(500, 'Description too long').optional().nullable(),
});

// ============================================================================
// Role-Permission Assignment Schemas
// ============================================================================

export const assignPermissionsToRoleSchema = z.object({
  roleId: z.string().cuid('Invalid role ID'),
  permissionIds: z
    .array(z.string().cuid('Invalid permission ID'))
    .min(1, 'At least one permission required'),
});

export const removePermissionFromRoleSchema = z.object({
  roleId: z.string().cuid('Invalid role ID'),
  permissionId: z.string().cuid('Invalid permission ID'),
});

export const setRolePermissionsSchema = z.object({
  roleId: z.string().cuid('Invalid role ID'),
  permissionIds: z.array(z.string().cuid('Invalid permission ID')),
});

// ============================================================================
// User-Role Assignment Schemas
// ============================================================================

export const assignRolesToUserSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  roleIds: z.array(z.string().cuid('Invalid role ID')).min(1, 'At least one role required'),
});

export const removeRoleFromUserSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  roleId: z.string().cuid('Invalid role ID'),
});

export const setUserRolesSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  roleIds: z.array(z.string().cuid('Invalid role ID')),
});

// ============================================================================
// Permission Check Schemas
// ============================================================================

export const checkPermissionSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  permission: permissionStringSchema,
});

export const checkPermissionsSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  permissions: z.array(permissionStringSchema).min(1, 'At least one permission required'),
  requireAll: z.boolean().optional().default(false),
});

export const checkRoleSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  roleName: z.string().min(1, 'Role name is required'),
});

export const checkRolesSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  roleNames: z.array(z.string().min(1)).min(1, 'At least one role required'),
  requireAll: z.boolean().optional().default(false),
});

// ============================================================================
// Query Schemas
// ============================================================================

export const listRolesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  includeSystem: z.coerce.boolean().optional().default(true),
});

export const listPermissionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  resource: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
export type PermissionString = z.infer<typeof permissionStringSchema>;

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export type AssignPermissionsToRoleInput = z.infer<typeof assignPermissionsToRoleSchema>;
export type RemovePermissionFromRoleInput = z.infer<typeof removePermissionFromRoleSchema>;
export type SetRolePermissionsInput = z.infer<typeof setRolePermissionsSchema>;

export type AssignRolesToUserInput = z.infer<typeof assignRolesToUserSchema>;
export type RemoveRoleFromUserInput = z.infer<typeof removeRoleFromUserSchema>;
export type SetUserRolesInput = z.infer<typeof setUserRolesSchema>;

export type CheckPermissionInput = z.infer<typeof checkPermissionSchema>;
export type CheckPermissionsInput = z.infer<typeof checkPermissionsSchema>;
export type CheckRoleInput = z.infer<typeof checkRoleSchema>;
export type CheckRolesInput = z.infer<typeof checkRolesSchema>;

export type ListRolesQuery = z.infer<typeof listRolesQuerySchema>;
export type ListPermissionsQuery = z.infer<typeof listPermissionsQuerySchema>;
