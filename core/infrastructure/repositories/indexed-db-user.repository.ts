import { IUserRepository } from '@/core/domain/repositories/user.repository.interface';
import { User, UserStatus, UserProps } from '@/core/domain/entities/user.entity';
import { Role } from '@/core/domain/entities/role.entity';
import { Email } from '@/core/domain/value-objects/email';
import { Password } from '@/core/domain/value-objects/password';
import { BrowserDatabase } from '../database/browser-db';
import { v4 as uuidv4 } from 'uuid';
import { IndexedDBRoleRepository } from './indexed-db-role.repository';

export class IndexedDBUserRepository implements IUserRepository {
  private roleRepository: IndexedDBRoleRepository;

  constructor() {
    this.roleRepository = new IndexedDBRoleRepository();
  }

  async save(user: User): Promise<User> {
    const db = await BrowserDatabase.getInstance();
    const data = user.toPersistence();
    const roleIds = user.roles.map((r) => r.id);

    if (!data.id) {
      data.id = uuidv4();
    }

    const userData = {
      id: data.id,
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image,
      status: data.status,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      roleIds,
    };

    await db.put('users', userData);
    return this.toDomain(userData);
  }

  async findById(id: string): Promise<User | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.get('users', id);
    return data ? this.toDomain(data) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.getFromIndex('users', 'by-email', email.getValue());
    return data ? this.toDomain(data) : null;
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    const db = await BrowserDatabase.getInstance();
    const allData = await db.getAll('users');
    const sliced = allData.slice(skip, skip + take);

    const users: User[] = [];
    for (const data of sliced) {
      users.push(await this.toDomain(data));
    }
    return users;
  }

  async count(): Promise<number> {
    const db = await BrowserDatabase.getInstance();
    return db.count('users');
  }

  async update(user: User): Promise<User> {
    return this.save(user);
  }

  async delete(id: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    await db.delete('users', id);
  }

  async emailExists(email: Email, excludeUserId?: string): Promise<boolean> {
    const existing = await this.findByEmail(email);
    if (!existing) return false;
    if (excludeUserId && existing.id === excludeUserId) return false;
    return true;
  }

  private async toDomain(
    userData: Omit<UserProps, 'roles' | 'email' | 'password'> & {
      roleIds?: string[];
      email: string;
      password: string;
    }
  ): Promise<User> {
    const roles: Role[] = [];
    if (userData.roleIds && Array.isArray(userData.roleIds)) {
      for (const roleId of userData.roleIds) {
        const role = await this.roleRepository.findById(roleId);
        if (role) {
          roles.push(role);
        }
      }
    }

    return User.fromPersistence({
      id: userData.id,
      email: Email.create(userData.email),
      password: Password.fromHash(userData.password),
      name: userData.name,
      image: userData.image,
      roles,
      status: userData.status as UserStatus,
      emailVerified: userData.emailVerified,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }
}
