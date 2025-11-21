import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { User, UserStatus } from '@/core/domain/entities/user.entity';
import { Role } from '@/core/domain/entities/role.entity';
import { Permission } from '@/core/domain/entities/permission.entity';
import { Email } from '@/core/domain/value-objects/email';
import { Password } from '@/core/domain/value-objects/password';
import { prisma } from '../database/prisma';

/**
 * Prisma User Repository Implementation
 * Implements IUserRepository using Prisma ORM
 */
export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    const data = user.toPersistence();
    const roleIds = user.roles.map((r) => r.id);

    const created = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image,
        status: data.status,
        emailVerified: data.emailVerified,
        userRoles: roleIds.length > 0 ? {
          create: roleIds.map((roleId) => ({
            roleId,
          })),
        } : undefined,
      },
      include: {
        userRoles: {
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
        },
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
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
        },
      },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.getValue() },
      include: {
        userRoles: {
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
        },
      },
    });

    return user ? this.toDomain(user) : null;
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    const users = await prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        userRoles: {
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
        },
      },
    });

    return users.map((user) => this.toDomain(user));
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async update(user: User): Promise<User> {
    const data = user.toPersistence();

    const updated = await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image,
        status: data.status,
        emailVerified: data.emailVerified,
        updatedAt: data.updatedAt,
      },
      include: {
        userRoles: {
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
        },
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async emailExists(email: Email, excludeUserId?: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email: email.getValue() },
      select: { id: true },
    });

    if (!user) {
      return false;
    }

    if (excludeUserId && user.id === excludeUserId) {
      return false;
    }

    return true;
  }

  /**
   * Converts Prisma model to Domain entity
   */
  private toDomain(prismaUser: any): User {
    const roles = (prismaUser.userRoles || []).map((ur: any) => {
      const permissions = (ur.role.rolePermissions || []).map((rp: any) =>
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
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        isSystem: ur.role.isSystem,
        permissions,
        createdAt: ur.role.createdAt,
        updatedAt: ur.role.updatedAt,
      });
    });

    return User.fromPersistence({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      password: Password.fromHash(prismaUser.password),
      name: prismaUser.name,
      image: prismaUser.image,
      roles,
      status: prismaUser.status as UserStatus,
      emailVerified: prismaUser.emailVerified,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}

