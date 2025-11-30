import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { IndexedDBUserRepository } from './indexed-db-user.repository';
import { IndexedDBRoleRepository } from './indexed-db-role.repository';
import { IndexedDBPermissionRepository } from './indexed-db-permission.repository';
import { User, UserStatus } from '@/core/domain/entities/user.entity';
import { Role } from '@/core/domain/entities/role.entity';
import { Permission } from '@/core/domain/entities/permission.entity';
import { Email } from '@/core/domain/value-objects/email';
import { Password } from '@/core/domain/value-objects/password';
import { BrowserDatabase } from '../database/browser-db';

describe('IndexedDB Repositories', () => {
  let userRepo: IndexedDBUserRepository;
  let roleRepo: IndexedDBRoleRepository;
  let permRepo: IndexedDBPermissionRepository;

  beforeEach(async () => {
    // Reset DB or just use new instances if they were stateless, but they use a singleton DB connection.
    // fake-indexeddb is in-memory, so it resets on process exit, but not between tests unless we clear it.
    // For simplicity, we'll just rely on unique IDs or cleanup if needed.
    // Actually, we can delete the database.
    const { deleteDB } = await import('idb');
    await BrowserDatabase.reset();
    await deleteDB('admin-dashboard-db');

    userRepo = new IndexedDBUserRepository();
    roleRepo = new IndexedDBRoleRepository();
    permRepo = new IndexedDBPermissionRepository();
  });

  it('should save and retrieve a permission', async () => {
    const perm = Permission.create({
      name: 'Test Permission',
      description: 'Test Description',
      resource: 'test',
      action: 'read',
    });

    const saved = await permRepo.save(perm);
    expect(saved.id).toBeDefined();

    const retrieved = await permRepo.findById(saved.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Test Permission');
  });

  it('should save and retrieve a role with permissions', async () => {
    const perm = Permission.create({
      name: 'Role Permission',
      description: 'Desc',
      resource: 'role_test',
      action: 'write',
    });
    const savedPerm = await permRepo.save(perm);

    const role = Role.create({
      name: 'Test_Role',
      description: 'Test Role Desc',
      isSystem: false,
      permissions: [savedPerm],
    });

    const savedRole = await roleRepo.save(role);
    expect(savedRole.id).toBeDefined();
    expect(savedRole.permissions).toHaveLength(1);
    expect(savedRole.permissions[0].id).toBe(savedPerm.id);

    const retrievedRole = await roleRepo.findById(savedRole.id);
    expect(retrievedRole).toBeDefined();
    expect(retrievedRole?.name).toBe('Test_Role');
    expect(retrievedRole?.permissions).toHaveLength(1);
    expect(retrievedRole?.permissions[0].name).toBe('Role Permission');
  });

  it('should save and retrieve a user with roles', async () => {
    const role = Role.create({
      name: 'User_Role',
      description: 'User Role Desc',
      isSystem: false,
    });
    const savedRole = await roleRepo.save(role);

    const user = User.create({
      email: Email.create('test@example.com'),
      password: await Password.create('Password123!'),
      name: 'Test User',
      image: null,
      status: UserStatus.ACTIVE,
      emailVerified: null,
      roles: [savedRole],
    });

    const savedUser = await userRepo.save(user);
    expect(savedUser.id).toBeDefined();
    expect(savedUser.roles).toHaveLength(1);
    expect(savedUser.roles[0].id).toBe(savedRole.id);

    const retrievedUser = await userRepo.findById(savedUser.id);
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.email.getValue()).toBe('test@example.com');
    expect(retrievedUser?.roles).toHaveLength(1);
    expect(retrievedUser?.roles[0].name).toBe('User_Role');
  });
});
