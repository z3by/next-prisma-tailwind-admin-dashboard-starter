import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { User, UserRole, UserStatus } from '@/core/domain/entities/user.entity';
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

    const created = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image,
        role: data.role,
        status: data.status,
        emailVerified: data.emailVerified,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return user ? this.toDomain(user) : null;
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    const users = await prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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
        role: data.role,
        status: data.status,
        emailVerified: data.emailVerified,
        updatedAt: data.updatedAt,
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
    return User.fromPersistence({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      password: Password.fromHash(prismaUser.password),
      name: prismaUser.name,
      image: prismaUser.image,
      role: prismaUser.role as UserRole,
      status: prismaUser.status as UserStatus,
      emailVerified: prismaUser.emailVerified,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}

