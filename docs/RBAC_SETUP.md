# RBAC Setup Guide

Quick guide to set up and use the RBAC system in your application.

## Prerequisites

- PostgreSQL database running
- Environment variables configured in `.env`
- Prisma installed

## Step 1: Run Database Migrations

Create the RBAC tables in your database:

```bash
npm run db:migrate
```

This will create the following tables:

- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

## Step 2: Seed Default Roles and Permissions

Create a seed script to populate initial roles and permissions:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import {
  PERMISSIONS,
  SYSTEM_ROLES,
  DEFAULT_ROLE_PERMISSIONS,
} from '../lib/constants/rbac.constants';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding RBAC data...');

  // Create all permissions
  const permissionsToCreate = Object.values(PERMISSIONS);

  for (const permString of permissionsToCreate) {
    const [resource, action] = permString.split(':');

    await prisma.permission.upsert({
      where: { resource_action: { resource, action } },
      update: {},
      create: {
        name: permString,
        resource,
        action,
        description: `Permission for ${resource}:${action}`,
      },
    });
  }

  console.log(`Created ${permissionsToCreate.length} permissions`);

  // Create system roles
  for (const [roleName, permStrings] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `System role: ${roleName}`,
        isSystem: true,
      },
    });

    // Get permission IDs
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: permStrings },
      },
    });

    // Assign permissions to role
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }

    console.log(`Created role ${roleName} with ${permissions.length} permissions`);
  }

  console.log('RBAC seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:

```bash
npx tsx prisma/seed.ts
```

Or add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Then run:

```bash
npm run db:seed
```

## Step 3: Assign Roles to Existing Users

Update existing users to have roles:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignDefaultRoles() {
  const userRole = await prisma.role.findUnique({
    where: { name: 'USER' },
  });

  if (!userRole) {
    throw new Error('USER role not found. Run seed first.');
  }

  const usersWithoutRoles = await prisma.user.findMany({
    where: {
      userRoles: {
        none: {},
      },
    },
  });

  for (const user of usersWithoutRoles) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: userRole.id,
      },
    });
    console.log(`Assigned USER role to ${user.email}`);
  }

  console.log(`Assigned roles to ${usersWithoutRoles.length} users`);
}

assignDefaultRoles();
```

## Step 4: Protect Your API Routes

Use the `withAuthorization` middleware:

```typescript
// app/api/users/route.ts
import { withAuthorization } from '@/lib/auth/with-authorization';
import { PERMISSIONS } from '@/lib/constants/rbac.constants';
import { NextResponse } from 'next/server';

export const GET = withAuthorization(
  async (request, { user }) => {
    // User has users:list permission
    const users = await listUsers();
    return NextResponse.json({ users });
  },
  {
    permission: PERMISSIONS.USERS_LIST,
  }
);

export const POST = withAuthorization(
  async (request, { user }) => {
    // User has users:create permission
    const body = await request.json();
    const newUser = await createUser(body);
    return NextResponse.json(newUser);
  },
  {
    permission: PERMISSIONS.USERS_CREATE,
  }
);
```

## Step 5: Use Authorization Guards in Use Cases

```typescript
// core/application/use-cases/delete-user.use-case.ts
import { requirePermission } from '@/lib/auth/authorization';
import { PERMISSIONS } from '@/lib/constants/rbac.constants';

export class DeleteUserUseCase {
  async execute(userId: string, currentUser: User): Promise<void> {
    // Check permission
    requirePermission(currentUser, PERMISSIONS.USERS_DELETE);

    // Delete logic
    await this.userRepository.delete(userId);
  }
}
```

## Step 6: Client-Side Authorization

```typescript
'use client';

import { useUser } from '@/hooks/use-user';
import { hasPermission } from '@/lib/auth/authorization';
import { PERMISSIONS } from '@/lib/constants/rbac.constants';

export function UserManagement() {
  const { user } = useUser();

  const canCreate = hasPermission(user, PERMISSIONS.USERS_CREATE);
  const canDelete = hasPermission(user, PERMISSIONS.USERS_DELETE);

  return (
    <div>
      {canCreate && <CreateUserButton />}
      {canDelete && <DeleteUserButton />}
    </div>
  );
}
```

## Creating Custom Permissions

```typescript
import { PrismaPermissionRepository } from '@/core/infrastructure/repositories/prisma-permission.repository';
import { Permission } from '@/core/domain/entities/permission.entity';

const repo = new PrismaPermissionRepository();

// Create custom permission
const permission = Permission.create({
  name: 'Create Invoices',
  description: 'Allows creating invoices',
  resource: 'invoices',
  action: 'create',
});

await repo.save(permission);
```

## Creating Custom Roles

```typescript
import { PrismaRoleRepository } from '@/core/infrastructure/repositories/prisma-role.repository';
import { PrismaPermissionRepository } from '@/core/infrastructure/repositories/prisma-permission.repository';
import { Role } from '@/core/domain/entities/role.entity';

const roleRepo = new PrismaRoleRepository();
const permRepo = new PrismaPermissionRepository();

// Get permissions
const invoicePerms = await permRepo.findByResource('invoices');

// Create role
const accountantRole = Role.create({
  name: 'ACCOUNTANT',
  description: 'Accounting team role',
  isSystem: false,
  permissions: invoicePerms,
});

await roleRepo.save(accountantRole);
```

## Assigning Roles to Users

```typescript
import { PrismaRoleRepository } from '@/core/infrastructure/repositories/prisma-role.repository';

const roleRepo = new PrismaRoleRepository();

// Assign single role
await roleRepo.assignToUser(userId, roleId);

// Set multiple roles (replaces all existing roles)
await roleRepo.setUserRoles(userId, [roleId1, roleId2, roleId3]);

// Remove role
await roleRepo.removeFromUser(userId, roleId);
```

## Checking Permissions

### In API Routes

```typescript
export const PUT = withAuthorization(
  async (request, { user, params }) => {
    // Multiple conditions
    return NextResponse.json({ success: true });
  },
  {
    anyPermissions: [PERMISSIONS.POSTS_UPDATE, PERMISSIONS.POSTS_MANAGE],
    customCheck: async (user) => {
      // Additional custom logic
      return true;
    },
  }
);
```

### In Use Cases

```typescript
import {
  requirePermission,
  requireOwnershipOrPermission,
  hasPermission,
} from '@/lib/auth/authorization';

// Throw if not authorized
requirePermission(user, 'posts:delete');

// Check ownership or permission
requireOwnershipOrPermission(user, post.authorId, 'posts:update');

// Boolean check (doesn't throw)
if (hasPermission(user, 'analytics:view')) {
  // Show analytics
}
```

## Testing RBAC

```typescript
// Test permission checking
describe('User permissions', () => {
  it('should have permission through role', () => {
    const permission = Permission.create({
      name: 'Create Users',
      resource: 'users',
      action: 'create',
    });

    const role = Role.create({
      name: 'ADMIN',
      permissions: [permission],
    });

    const user = User.create({
      roles: [role],
      // ... other props
    });

    expect(user.hasPermission('users:create')).toBe(true);
  });
});
```

## Common Issues

### Issue: Users have no roles after migration

**Solution**: Run the role assignment script (Step 3)

### Issue: Permission denied even though user has role

**Solution**: Check that the role has the required permission assigned. Query the database:

```sql
SELECT r.name as role, p.name as permission
FROM roles r
JOIN role_permissions rp ON r.id = rp."roleId"
JOIN permissions p ON rp."permissionId" = p.id
WHERE r.name = 'ADMIN';
```

### Issue: Cannot create users without roles

**Solution**: The `CreateUserUseCase` defaults to USER role if no roles specified. Make sure USER role exists in database.

## Next Steps

1. ✅ Set up database with migrations
2. ✅ Seed roles and permissions
3. ✅ Assign roles to users
4. ✅ Protect API routes
5. Create admin UI for role management
6. Create admin UI for user-role assignment
7. Implement audit logging

## Resources

- [RBAC Guide](./RBAC_GUIDE.md) - Complete usage guide
- [RBAC Implementation Summary](./RBAC_IMPLEMENTATION_SUMMARY.md) - Technical details
- [Architecture Guide](./ARCHITECTURE.md) - Clean architecture principles

---

**Need Help?**

Check the comprehensive [RBAC Guide](./RBAC_GUIDE.md) for detailed examples and best practices.
