import { Prisma } from '@prisma/client';

/**
 * Prisma Model Types
 * Type-safe types for Prisma query results
 */

// User with relations
export type PrismaUserWithRoles = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

// Role with permissions
export type PrismaRoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    rolePermissions: {
      include: {
        permission: true;
      };
    };
  };
}>;

// Permission (no relations needed)
export type PrismaPermission = Prisma.PermissionGetPayload<object>;

// User Role join with role and permissions
export type PrismaUserRoleWithRole = Prisma.UserRoleGetPayload<{
  include: {
    role: {
      include: {
        rolePermissions: {
          include: {
            permission: true;
          };
        };
      };
    };
  };
}>;

// Role Permission join
export type PrismaRolePermissionWithPermission = Prisma.RolePermissionGetPayload<{
  include: {
    permission: true;
  };
}>;
