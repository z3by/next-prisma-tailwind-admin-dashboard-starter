import { IRoleRepository } from '@/core/domain/repositories/role.repository.interface';
import { Role, RoleProps } from '@/core/domain/entities/role.entity';
import { Permission } from '@/core/domain/entities/permission.entity';
import { BrowserDatabase } from '../database/browser-db';
import { v4 as uuidv4 } from 'uuid';
import { IndexedDBPermissionRepository } from './indexed-db-permission.repository';

export class IndexedDBRoleRepository implements IRoleRepository {
  private permissionRepository: IndexedDBPermissionRepository;

  constructor() {
    this.permissionRepository = new IndexedDBPermissionRepository();
  }

  async save(role: Role): Promise<Role> {
    const db = await BrowserDatabase.getInstance();
    const data = role.toPersistence();
    const permissionIds = role.permissions.map((p) => p.id);

    if (!data.id) {
      data.id = uuidv4();
    }

    // We need to store permissionIds with the role data
    const roleData = {
      id: data.id,
      name: data.name,
      description: data.description,
      isSystem: data.isSystem,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      permissionIds,
    };
    await db.put('roles', roleData);

    // We also need to ensure permissions exist, but usually they should be saved separately.
    // However, for this demo, we assume permissions are already saved or we just link them.

    return this.toDomain(roleData);
  }

  async findById(id: string): Promise<Role | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.get('roles', id);
    return data ? this.toDomain(data) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.getFromIndex('roles', 'by-name', name);
    return data ? this.toDomain(data) : null;
  }

  async findAll(skip = 0, take = 10): Promise<Role[]> {
    const db = await BrowserDatabase.getInstance();
    const allData = await db.getAll('roles');
    const sliced = allData.slice(skip, skip + take);

    const roles: Role[] = [];
    for (const data of sliced) {
      roles.push(await this.toDomain(data));
    }
    return roles;
  }

  async findByUserId(userId: string): Promise<Role[]> {
    const db = await BrowserDatabase.getInstance();
    const user = await db.get('users', userId);
    if (!user || !user.roleIds) return [];

    const roles: Role[] = [];
    for (const roleId of user.roleIds) {
      const role = await this.findById(roleId);
      if (role) {
        roles.push(role);
      }
    }
    return roles;
  }

  async count(): Promise<number> {
    const db = await BrowserDatabase.getInstance();
    return db.count('roles');
  }

  async update(role: Role): Promise<Role> {
    return this.save(role);
  }

  async delete(id: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    await db.delete('roles', id);
  }

  async nameExists(name: string, excludeRoleId?: string): Promise<boolean> {
    const existing = await this.findByName(name);
    if (!existing) return false;
    if (excludeRoleId && existing.id === excludeRoleId) return false;
    return true;
  }

  async assignToUser(userId: string, roleId: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    const user = await db.get('users', userId);
    if (!user) throw new Error('User not found');

    if (!user.roleIds.includes(roleId)) {
      user.roleIds.push(roleId);
      await db.put('users', user);
    }
  }

  async removeFromUser(userId: string, roleId: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    const user = await db.get('users', userId);
    if (!user) throw new Error('User not found');

    user.roleIds = user.roleIds.filter((id) => id !== roleId);
    await db.put('users', user);
  }

  async setUserRoles(userId: string, roleIds: string[]): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    const user = await db.get('users', userId);
    if (!user) throw new Error('User not found');

    user.roleIds = roleIds;
    await db.put('users', user);
  }

  private async toDomain(
    roleData: Omit<RoleProps, 'permissions'> & { permissionIds?: string[] }
  ): Promise<Role> {
    const permissions: Permission[] = [];
    if (roleData.permissionIds && Array.isArray(roleData.permissionIds)) {
      for (const permId of roleData.permissionIds) {
        const perm = await this.permissionRepository.findById(permId);
        if (perm) {
          permissions.push(perm);
        }
      }
    }

    return Role.fromPersistence({
      id: roleData.id,
      name: roleData.name,
      description: roleData.description,
      isSystem: roleData.isSystem,
      permissions,
      createdAt: roleData.createdAt,
      updatedAt: roleData.updatedAt,
    });
  }
}
