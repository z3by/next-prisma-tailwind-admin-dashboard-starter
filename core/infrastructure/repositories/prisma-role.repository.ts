import { IRoleRepository } from '@/core/domain/repositories/role.repository.interface';
import { Role } from '@/core/domain/entities/role.entity';
import { Permission } from '@/core/domain/entities/permission.entity';
import { prisma } from '../database/prisma';

/**
 * Prisma Role Repository Implementation
 * Implements IRoleRepository using Prisma ORM
 */
export class PrismaRoleRepository implements IRoleRepository {
  async save(role: Role): Promise<Role> {
    const data = role.toPersistence();
    const permissionIds = role.permissions.map((p) => p.id);

    const created = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        isSystem: data.isSystem,
        rolePermissions: {
          create: permissionIds.map((permissionId) => ({
            permissionId,
          })),
        },
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? this.toDomain(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { name },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role ? this.toDomain(role) : null;
  }

  async findAll(skip = 0, take = 10): Promise<Role[]> {
    const roles = await prisma.role.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roles.map((role) => this.toDomain(role));
  }

  async findByUserId(userId: string): Promise<Role[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return userRoles.map((ur) => this.toDomain(ur.role));
  }

  async count(): Promise<number> {
    return prisma.role.count();
  }

  async update(role: Role): Promise<Role> {
    const data = role.toPersistence();

    const updated = await prisma.role.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        isSystem: data.isSystem,
        updatedAt: data.updatedAt,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.role.delete({
      where: { id },
    });
  }

  async nameExists(name: string, excludeRoleId?: string): Promise<boolean> {
    const role = await prisma.role.findUnique({
      where: { name },
      select: { id: true },
    });

    if (!role) {
      return false;
    }

    if (excludeRoleId && role.id === excludeRoleId) {
      return false;
    }

    return true;
  }

  async assignToUser(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeFromUser(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }

  async setUserRoles(userId: string, roleIds: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Delete existing roles
      await tx.userRole.deleteMany({
        where: { userId },
      });

      // Create new roles
      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId,
            roleId,
          })),
        });
      }
    });
  }

  /**
   * Converts Prisma model to Domain entity
   */
  private toDomain(prismaRole: any): Role {
    const permissions = prismaRole.rolePermissions.map((rp: any) =>
      Permission.fromPersistence({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
        resource: rp.permission.resource,
        action: rp.permission.action,
        createdAt: rp.permission.createdAt,
        updatedAt: rp.permission.updatedAt,
      })
    );

    return Role.fromPersistence({
      id: prismaRole.id,
      name: prismaRole.name,
      description: prismaRole.description,
      isSystem: prismaRole.isSystem,
      permissions,
      createdAt: prismaRole.createdAt,
      updatedAt: prismaRole.updatedAt,
    });
  }
}

