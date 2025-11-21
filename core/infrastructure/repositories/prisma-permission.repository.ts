import { IPermissionRepository } from '@/core/domain/repositories/permission.repository.interface';
import { Permission } from '@/core/domain/entities/permission.entity';
import { prisma } from '../database/prisma';

/**
 * Prisma Permission Repository Implementation
 * Implements IPermissionRepository using Prisma ORM
 */
export class PrismaPermissionRepository implements IPermissionRepository {
  async save(permission: Permission): Promise<Permission> {
    const data = permission.toPersistence();

    const created = await prisma.permission.create({
      data: {
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    return permission ? this.toDomain(permission) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await prisma.permission.findUnique({
      where: { name },
    });

    return permission ? this.toDomain(permission) : null;
  }

  async findByResourceAndAction(resource: string, action: string): Promise<Permission | null> {
    const permission = await prisma.permission.findUnique({
      where: {
        resource_action: {
          resource,
          action,
        },
      },
    });

    return permission ? this.toDomain(permission) : null;
  }

  async findAll(skip = 0, take = 10): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return permissions.map((permission) => this.toDomain(permission));
  }

  async findByRoleId(roleId: string): Promise<Permission[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp) => this.toDomain(rp.permission));
  }

  async findByUserId(userId: string): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            role: {
              userRoles: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
      distinct: ['id'],
    });

    return permissions.map((permission) => this.toDomain(permission));
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
      where: { resource },
      orderBy: { action: 'asc' },
    });

    return permissions.map((permission) => this.toDomain(permission));
  }

  async count(): Promise<number> {
    return prisma.permission.count();
  }

  async update(permission: Permission): Promise<Permission> {
    const data = permission.toPersistence();

    const updated = await prisma.permission.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
        updatedAt: data.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.permission.delete({
      where: { id },
    });
  }

  async exists(resource: string, action: string, excludePermissionId?: string): Promise<boolean> {
    const permission = await prisma.permission.findUnique({
      where: {
        resource_action: {
          resource,
          action,
        },
      },
      select: { id: true },
    });

    if (!permission) {
      return false;
    }

    if (excludePermissionId && permission.id === excludePermissionId) {
      return false;
    }

    return true;
  }

  async assignToRole(roleId: string, permissionId: string): Promise<void> {
    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async removeFromRole(roleId: string, permissionId: string): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }

  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Delete existing permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // Create new permissions
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
          })),
        });
      }
    });
  }

  /**
   * Converts Prisma model to Domain entity
   */
  private toDomain(prismaPermission: any): Permission {
    return Permission.fromPersistence({
      id: prismaPermission.id,
      name: prismaPermission.name,
      description: prismaPermission.description,
      resource: prismaPermission.resource,
      action: prismaPermission.action,
      createdAt: prismaPermission.createdAt,
      updatedAt: prismaPermission.updatedAt,
    });
  }
}

