import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/core/domain/entities/user.entity';
import { UnauthorizedError } from '@/core/domain/errors/domain-error';
import {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireAnyRole,
  requireAllRoles,
  requireAdmin,
  requireSuperAdmin,
} from './authorization';

/**
 * Authorization Configuration
 */
export interface AuthorizationConfig {
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

/**
 * API Route Handler with User
 */
export type AuthorizedRouteHandler = (
  request: NextRequest,
  context: { params?: Record<string, string>; user: User }
) => Promise<Response> | Response;

/**
 * Higher-order function to protect API routes with authorization
 *
 * @example
 * ```typescript
 * export const POST = withAuthorization(
 *   async (request, { user }) => {
 *     // Handler logic with authenticated user
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     permission: 'users:create',
 *   }
 * );
 * ```
 *
 * @example
 * ```typescript
 * export const DELETE = withAuthorization(
 *   async (request, { params, user }) => {
 *     // Handler logic
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     anyRoles: ['ADMIN', 'SUPER_ADMIN'],
 *   }
 * );
 * ```
 */
export function withAuthorization(
  handler: AuthorizedRouteHandler,
  config: AuthorizationConfig = {}
): (request: NextRequest, context?: { params?: Record<string, string> }) => Promise<Response> {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      // TODO: Get user from session (integrate with NextAuth)
      // For now, we'll assume user is in request context
      // In practice, this would be extracted from session/token
      const user = (request as unknown as { user?: User }).user as User | null;

      if (!user) {
        return NextResponse.json(
          {
            error: 'Authentication required',
            message: 'You must be logged in to access this resource',
          },
          { status: 401 }
        );
      }

      // Check permissions
      if (config.permission) {
        requirePermission(user, config.permission);
      }

      if (config.anyPermissions) {
        requireAnyPermission(user, config.anyPermissions);
      }

      if (config.allPermissions) {
        requireAllPermissions(user, config.allPermissions);
      }

      // Check roles
      if (config.role) {
        requireRole(user, config.role);
      }

      if (config.anyRoles) {
        requireAnyRole(user, config.anyRoles);
      }

      if (config.allRoles) {
        requireAllRoles(user, config.allRoles);
      }

      // Check admin/super admin
      if (config.requireAdmin) {
        requireAdmin(user);
      }

      if (config.requireSuperAdmin) {
        requireSuperAdmin(user);
      }

      // Custom check
      if (config.customCheck) {
        const result = await config.customCheck(user);
        if (!result) {
          throw new UnauthorizedError(config.errorMessage || 'Custom authorization check failed');
        }
      }

      // Call the actual handler with user in context
      return await handler(request, { ...context, user });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            message: error.message,
          },
          { status: 403 }
        );
      }

      // Re-throw other errors
      throw error;
    }
  };
}

/**
 * Shorthand for requiring specific permission
 */
export function requirePermissionMiddleware(permission: string) {
  return withAuthorization(
    () => {
      return NextResponse.next();
    },
    { permission }
  );
}

/**
 * Shorthand for requiring admin role
 */
export function requireAdminMiddleware() {
  return withAuthorization(
    () => {
      return NextResponse.next();
    },
    { requireAdmin: true }
  );
}

/**
 * Shorthand for requiring super admin role
 */
export function requireSuperAdminMiddleware() {
  return withAuthorization(
    () => {
      return NextResponse.next();
    },
    { requireSuperAdmin: true }
  );
}

/**
 * Example usage in API route:
 *
 * ```typescript
 * // app/api/users/route.ts
 * import { withAuthorization } from '@/lib/auth/with-authorization';
 * import { PERMISSIONS } from '@/lib/constants/rbac.constants';
 *
 * export const POST = withAuthorization(
 *   async (request, { user }) => {
 *     // Your handler logic here
 *     const body = await request.json();
 *
 *     // Create user logic
 *
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     permission: PERMISSIONS.USERS_CREATE,
 *   }
 * );
 *
 * export const GET = withAuthorization(
 *   async (request, { user }) => {
 *     // List users logic
 *
 *     return NextResponse.json({ users: [] });
 *   },
 *   {
 *     anyPermissions: [PERMISSIONS.USERS_LIST, PERMISSIONS.USERS_MANAGE],
 *   }
 * );
 * ```
 */
