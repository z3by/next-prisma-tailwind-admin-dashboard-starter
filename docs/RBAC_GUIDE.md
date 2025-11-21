# Role-Based Access Control (RBAC) Guide

Complete guide for using the configurable RBAC system in your Next.js admin dashboard.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Database Schema](#database-schema)
- [Domain Entities](#domain-entities)
- [Using RBAC in Your Application](#using-rbac-in-your-application)
- [API Protection](#api-protection)
- [Client-Side Authorization](#client-side-authorization)
- [Default Roles and Permissions](#default-roles-and-permissions)
- [Custom Roles and Permissions](#custom-roles-and-permissions)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

The RBAC system provides fine-grained access control through:

- **Roles**: Named groups of permissions (e.g., ADMIN, USER)
- **Permissions**: Specific actions on resources (e.g., "users:create")
- **Users**: Can have multiple roles
- **Flexible Configuration**: Create custom roles and permissions as needed

### Key Features

✅ **Multi-Role Support**: Users can have multiple roles  
✅ **Permission-Based**: Fine-grained control with resource:action permissions  
✅ **Domain-Driven Design**: Clean architecture with pure business logic  
✅ **Type-Safe**: Full TypeScript support with validation  
✅ **Middleware Support**: Easy API route protection  
✅ **Database-Backed**: All roles and permissions stored in database  
✅ **Configurable**: Create and modify roles/permissions at runtime

## Core Concepts

### Permissions

Permissions are defined in the format **`resource:action`**:

```typescript
// Examples
'users:create'; // Can create users
'users:read'; // Can read user data
'users:update'; // Can update users
'users:delete'; // Can delete users
'users:manage'; // Full control over users (all CRUD)
```

**Components:**

- **Resource**: The entity or feature (e.g., `users`, `posts`, `settings`)
- **Action**: The operation (e.g., `create`, `read`, `update`, `delete`, `manage`)

### Roles

Roles are collections of permissions:

```typescript
// Example: ADMIN role has these permissions
{
  name: "ADMIN",
  permissions: [
    "users:create",
    "users:read",
    "users:update",
    "users:list",
    "posts:manage",
  ]
}
```

### System Roles

Three pre-defined system roles (cannot be deleted):

1. **SUPER_ADMIN**: Full access to everything
2. **ADMIN**: User and content management
3. **USER**: Basic user permissions

## Database Schema

```
Users
  ↓ (many-to-many)
UserRoles
  ↓ (many-to-many)
Roles
  ↓ (many-to-many)
RolePermissions
  ↓ (many-to-many)
Permissions
```

### Tables

**roles**

- `id`, `name`, `description`, `isSystem`
- System roles have `isSystem = true`

**permissions**

- `id`, `name`, `description`, `resource`, `action`
- Unique constraint on `(resource, action)`

**user_roles**

- Links users to roles
- Unique constraint on `(userId, roleId)`

**role_permissions**

- Links roles to permissions
- Unique constraint on `(roleId, permissionId)`

## Domain Entities

### Permission Entity

```typescript
import { Permission } from '@/core/domain/entities/permission.entity';

// Create a permission
const permission = Permission.create({
  name: 'Create Users',
  description: 'Allows creating new users',
  resource: 'users',
  action: 'create',
});

// Get permission string
permission.getPermissionString(); // "users:create"

// Check if matches
permission.matches('users', 'create'); // true
permission.matchesString('users:create'); // true
```

### Role Entity

```typescript
import { Role } from '@/core/domain/entities/role.entity';

// Create a role
const role = Role.create({
  name: 'EDITOR',
  description: 'Content editor role',
  isSystem: false,
  permissions: [permission1, permission2],
});

// Add permissions
role.addPermission(permission);
role.addPermissions([permission1, permission2]);

// Remove permissions
role.removePermission(permissionId);
role.setPermissions([permission1, permission2]);

// Check permissions
role.hasPermission('users:create'); // boolean
role.hasAnyPermission(['users:create', 'users:update']);
role.hasAllPermissions(['users:create', 'users:update']);

// Get all permissions
role.getPermissionStrings(); // ['users:create', 'posts:manage']
role.getPermissionsByResource(); // Map<string, string[]>
```

### User Entity (with RBAC)

```typescript
import { User } from '@/core/domain/entities/user.entity';

// Create user with roles
const user = User.create({
  email: Email.create('admin@example.com'),
  password: await Password.create('password123'),
  roles: [adminRole, editorRole],
  status: UserStatus.ACTIVE,
});

// Manage roles
user.assignRole(role);
user.assignRoles([role1, role2]);
user.removeRole(roleId);
user.setRoles([role1, role2]);

// Check roles
user.hasRole('ADMIN'); // boolean
user.hasAnyRole(['ADMIN', 'EDITOR']);
user.hasAllRoles(['ADMIN', 'EDITOR']);

// Check permissions (through roles)
user.hasPermission('users:create'); // boolean
user.hasAnyPermission(['users:create', 'posts:create']);
user.hasAllPermissions(['users:create', 'users:update']);

// Get all permissions
user.getAllPermissions(); // ['users:create', 'posts:manage', ...]

// Get role names
user.getRoleNames(); // ['ADMIN', 'EDITOR']

// Helper methods
user.isAdmin(); // true if has ADMIN or SUPER_ADMIN role
user.isSuperAdmin(); // true if has SUPER_ADMIN role
user.canPerformAdminActions(); // true if active and admin
```

## Using RBAC in Your Application

### 1. Protecting API Routes

Use `withAuthorization` middleware to protect routes:

```typescript
// app/api/users/route.ts
import { withAuthorization } from '@/lib/auth/with-authorization';
import { PERMISSIONS } from '@/lib/constants/rbac.constants';
import { NextResponse } from 'next/server';

// Require specific permission
export const POST = withAuthorization(
  async (request, { user }) => {
    // User is guaranteed to have users:create permission
    const body = await request.json();

    // Create user logic

    return NextResponse.json({ success: true });
  },
  {
    permission: PERMISSIONS.USERS_CREATE,
  }
);

// Require any of multiple permissions
export const GET = withAuthorization(
  async (request, { user }) => {
    // User has either users:list OR users:manage
    // List users logic

    return NextResponse.json({ users: [] });
  },
  {
    anyPermissions: [PERMISSIONS.USERS_LIST, PERMISSIONS.USERS_MANAGE],
  }
);

// Require all permissions
export const PUT = withAuthorization(
  async (request, { user }) => {
    // User must have both permissions
    // Update logic

    return NextResponse.json({ success: true });
  },
  {
    allPermissions: [PERMISSIONS.USERS_UPDATE, PERMISSIONS.ROLES_UPDATE],
  }
);

// Require specific role
export const DELETE = withAuthorization(
  async (request, { user }) => {
    // User must be ADMIN or SUPER_ADMIN
    // Delete logic

    return NextResponse.json({ success: true });
  },
  {
    anyRoles: ['ADMIN', 'SUPER_ADMIN'],
  }
);

// Custom authorization logic
export const PATCH = withAuthorization(
  async (request, { user, params }) => {
    // Custom logic passed

    return NextResponse.json({ success: true });
  },
  {
    customCheck: async (user) => {
      // Your custom authorization logic
      return user.email.getValue().endsWith('@company.com');
    },
    errorMessage: 'Only company email addresses allowed',
  }
);
```

### 2. Using Authorization Guards

Use guard functions for imperative checks:

```typescript
import {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireAnyRole,
  requireAdmin,
  requireSuperAdmin,
  requireOwnershipOrPermission,
} from '@/lib/auth/authorization';

// In your use cases or route handlers
async function deleteUser(userId: string, currentUser: User) {
  // Require permission (throws if not authorized)
  requirePermission(currentUser, PERMISSIONS.USERS_DELETE);

  // Delete logic
}

// Check ownership or permission
async function updatePost(postId: string, currentUser: User, post: Post) {
  // User can update if they own it OR have posts:update permission
  requireOwnershipOrPermission(currentUser, post.authorId, PERMISSIONS.POSTS_UPDATE);

  // Update logic
}

// Require admin
async function viewAnalytics(currentUser: User) {
  requireAdmin(currentUser);

  // Show analytics
}
```

### 3. Boolean Permission Checks

For conditional logic (doesn't throw):

```typescript
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
} from '@/lib/auth/authorization';

async function getUserProfile(userId: string, currentUser: User) {
  const profile = await getProfile(userId);

  // Show sensitive data only if authorized
  if (hasPermission(currentUser, PERMISSIONS.USERS_MANAGE)) {
    profile.sensitiveData = await getSensitiveData(userId);
  }

  // Show admin panel if admin
  if (hasAnyRole(currentUser, ['ADMIN', 'SUPER_ADMIN'])) {
    profile.adminPanel = await getAdminPanel();
  }

  return profile;
}
```

## API Protection

### Configuration Options

```typescript
interface AuthorizationConfig {
  // Single permission required
  permission?: string;

  // At least one of these permissions required
  anyPermissions?: string[];

  // All of these permissions required
  allPermissions?: string[];

  // Single role required
  role?: string;

  // At least one of these roles required
  anyRoles?: string[];

  // All of these roles required
  allRoles?: string[];

  // Require admin role
  requireAdmin?: boolean;

  // Require super admin role
  requireSuperAdmin?: boolean;

  // Custom authorization logic
  customCheck?: (user: User) => boolean | Promise<boolean>;

  // Custom error message
  errorMessage?: string;
}
```

### Examples

```typescript
// Simple permission check
{ permission: 'users:create' }

// Any of multiple permissions
{ anyPermissions: ['users:create', 'users:manage'] }

// All of multiple permissions
{ allPermissions: ['users:update', 'roles:update'] }

// Role check
{ role: 'ADMIN' }

// Any of multiple roles
{ anyRoles: ['ADMIN', 'SUPER_ADMIN'] }

// Admin shorthand
{ requireAdmin: true }

// Super admin shorthand
{ requireSuperAdmin: true }

// Custom logic
{
  customCheck: async (user) => {
    // Your logic
    return true;
  },
  errorMessage: 'Custom error message'
}

// Multiple conditions (all must pass)
{
  permission: 'users:update',
  anyRoles: ['ADMIN', 'SUPER_ADMIN'],
  customCheck: (user) => user.email.getValue().endsWith('@company.com')
}
```

## Client-Side Authorization

### React Components

```typescript
'use client';

import { useUser } from '@/hooks/use-user';
import { hasPermission, hasRole } from '@/lib/auth/authorization';
import { PERMISSIONS } from '@/lib/constants/rbac.constants';

export function UserManagementPanel() {
  const { user } = useUser();

  // Conditional rendering based on permissions
  const canCreateUsers = hasPermission(user, PERMISSIONS.USERS_CREATE);
  const canDeleteUsers = hasPermission(user, PERMISSIONS.USERS_DELETE);
  const isAdmin = hasRole(user, 'ADMIN');

  return (
    <div>
      {canCreateUsers && (
        <button>Create User</button>
      )}

      {canDeleteUsers && (
        <button>Delete User</button>
      )}

      {isAdmin && (
        <div>Admin Panel</div>
      )}
    </div>
  );
}
```

## Default Roles and Permissions

### Pre-defined Permissions

See `lib/constants/rbac.constants.ts` for all pre-defined permissions:

```typescript
// User Management
PERMISSIONS.USERS_CREATE;
PERMISSIONS.USERS_READ;
PERMISSIONS.USERS_UPDATE;
PERMISSIONS.USERS_DELETE;
PERMISSIONS.USERS_MANAGE;
PERMISSIONS.USERS_LIST;
PERMISSIONS.USERS_EXPORT;

// Role Management
PERMISSIONS.ROLES_CREATE;
PERMISSIONS.ROLES_READ;
PERMISSIONS.ROLES_UPDATE;
PERMISSIONS.ROLES_DELETE;
PERMISSIONS.ROLES_MANAGE;
PERMISSIONS.ROLES_LIST;

// And more...
```

### System Roles

**SUPER_ADMIN**

- Full access to everything
- Cannot be deleted or modified

**ADMIN**

- User management (create, read, update, list, export)
- Content management (posts, comments)
- Analytics viewing
- Report viewing

**USER**

- Own profile management
- Content creation (posts, comments)
- Read access to public content

## Custom Roles and Permissions

### Creating Custom Permissions

```typescript
// 1. Define in constants (optional but recommended)
// lib/constants/rbac.constants.ts
export const CUSTOM_PERMISSIONS = {
  INVOICES_CREATE: 'invoices:create',
  INVOICES_APPROVE: 'invoices:approve',
  REPORTS_GENERATE: 'reports:generate',
};

// 2. Create in database
import { PrismaPermissionRepository } from '@/core/infrastructure/repositories/prisma-permission.repository';
import { Permission } from '@/core/domain/entities/permission.entity';

const permissionRepo = new PrismaPermissionRepository();

const permission = Permission.create({
  name: 'Create Invoices',
  description: 'Allows creating new invoices',
  resource: 'invoices',
  action: 'create',
});

await permissionRepo.save(permission);
```

### Creating Custom Roles

```typescript
import { PrismaRoleRepository } from '@/core/infrastructure/repositories/prisma-role.repository';
import { Role } from '@/core/domain/entities/role.entity';

const roleRepo = new PrismaRoleRepository();
const permissionRepo = new PrismaPermissionRepository();

// Get permissions
const invoicePermissions = await permissionRepo.findByResource('invoices');

// Create role
const role = Role.create({
  name: 'ACCOUNTANT',
  description: 'Accounting team role',
  isSystem: false,
  permissions: invoicePermissions,
});

await roleRepo.save(role);
```

### Assigning Roles to Users

```typescript
import { PrismaRoleRepository } from '@/core/infrastructure/repositories/prisma-role.repository';

const roleRepo = new PrismaRoleRepository();

// Assign single role
await roleRepo.assignToUser(userId, roleId);

// Replace all roles
await roleRepo.setUserRoles(userId, [roleId1, roleId2]);

// Remove role
await roleRepo.removeFromUser(userId, roleId);
```

## Best Practices

### 1. Use Constants for Permissions

```typescript
// ❌ Bad: Magic strings
requirePermission(user, 'users:create');

// ✅ Good: Use constants
import { PERMISSIONS } from '@/lib/constants/rbac.constants';
requirePermission(user, PERMISSIONS.USERS_CREATE);
```

### 2. Check Permissions, Not Roles

```typescript
// ❌ Bad: Checking roles
if (hasRole(user, 'ADMIN')) {
  // Delete user
}

// ✅ Good: Check specific permission
if (hasPermission(user, PERMISSIONS.USERS_DELETE)) {
  // Delete user
}
```

**Why?** Roles can change, but permissions are more stable. A user might have the delete permission through different roles.

### 3. Use Resource Ownership When Appropriate

```typescript
// ✅ Allow users to edit their own posts OR have permission
async function updatePost(postId: string, currentUser: User) {
  const post = await getPost(postId);

  requireOwnershipOrPermission(currentUser, post.authorId, PERMISSIONS.POSTS_UPDATE);

  // Update logic
}
```

### 4. Protect All API Routes

```typescript
// ❌ Bad: Unprotected route
export async function DELETE(request: Request) {
  // Anyone can call this!
}

// ✅ Good: Protected route
export const DELETE = withAuthorization(
  async (request, { user }) => {
    // Only authorized users
  },
  { permission: PERMISSIONS.USERS_DELETE }
);
```

### 5. Document Custom Permissions

```typescript
// Add descriptions for all custom permissions
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  'invoices:create': 'Create new invoices',
  'invoices:approve': 'Approve invoices for payment',
  'reports:generate': 'Generate financial reports',
};
```

### 6. Use Principle of Least Privilege

Give users the minimum permissions they need:

```typescript
// ❌ Bad: Too many permissions
const editorRole = {
  permissions: ['posts:manage', 'users:manage', 'settings:manage'],
};

// ✅ Good: Only what's needed
const editorRole = {
  permissions: ['posts:create', 'posts:update', 'posts:read'],
};
```

## Examples

### Example 1: Blog Post Management

```typescript
// Define permissions
const BLOG_PERMISSIONS = {
  POSTS_CREATE: 'posts:create',
  POSTS_UPDATE: 'posts:update',
  POSTS_DELETE: 'posts:delete',
  POSTS_PUBLISH: 'posts:publish',
};

// Create role
const editorRole = Role.create({
  name: 'EDITOR',
  permissions: [
    // Can create and update but not delete
    createPermission,
    updatePermission,
    publishPermission,
  ],
});

// Protect API routes
export const POST = withAuthorization(
  async (request, { user }) => {
    // Create post
  },
  { permission: BLOG_PERMISSIONS.POSTS_CREATE }
);

export const PUT = withAuthorization(
  async (request, { user, params }) => {
    const post = await getPost(params.id);

    // Can update own posts or have permission
    requireOwnershipOrPermission(user, post.authorId, BLOG_PERMISSIONS.POSTS_UPDATE);

    // Update post
  },
  { requireAuthenticated: true }
);
```

### Example 2: Multi-Tenant System

```typescript
// Custom check for tenant access
export const GET = withAuthorization(
  async (request, { user, params }) => {
    const tenantId = params.tenantId;

    // Get data
  },
  {
    permission: 'tenants:read',
    customCheck: async (user) => {
      // Check if user belongs to this tenant
      const tenants = await getUserTenants(user.id);
      return tenants.some((t) => t.id === params.tenantId);
    },
    errorMessage: 'Access denied to this tenant',
  }
);
```

### Example 3: Hierarchical Permissions

```typescript
// If user has 'manage' permission, they have all CRUD
function hasEffectivePermission(user: User, permission: string): boolean {
  const [resource, action] = permission.split(':');

  // Check explicit permission
  if (user.hasPermission(permission)) {
    return true;
  }

  // Check if has 'manage' permission for resource
  if (user.hasPermission(`${resource}:manage`)) {
    return true;
  }

  return false;
}
```

---

## Summary

The RBAC system provides:

✅ **Flexible Configuration**: Create custom roles and permissions  
✅ **Type-Safe**: Full TypeScript support  
✅ **Clean Architecture**: Domain-driven design  
✅ **Easy to Use**: Simple middleware and guards  
✅ **Database-Backed**: All changes persisted  
✅ **Production-Ready**: Tested and documented

For more details, see:

- Domain entities: `core/domain/entities/`
- Repositories: `core/infrastructure/repositories/`
- Constants: `lib/constants/rbac.constants.ts`
- Guards: `lib/auth/authorization.ts`
- Middleware: `lib/auth/with-authorization.ts`
