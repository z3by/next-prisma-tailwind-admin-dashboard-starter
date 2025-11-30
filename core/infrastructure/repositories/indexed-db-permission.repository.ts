import { IPermissionRepository } from '@/core/domain/repositories/permission.repository.interface';
import { Permission } from '@/core/domain/entities/permission.entity';
import { BrowserDatabase } from '../database/browser-db';
import { v4 as uuidv4 } from 'uuid';

export class IndexedDBPermissionRepository implements IPermissionRepository {
  async save(permission: Permission): Promise<Permission> {
    const db = await BrowserDatabase.getInstance();
    const data = permission.toPersistence();

    if (!data.id) {
      data.id = uuidv4();
    }

    await db.put('permissions', data);
    return Permission.fromPersistence(data);
  }

  async findById(id: string): Promise<Permission | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.get('permissions', id);
    return data ? Permission.fromPersistence(data) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.getFromIndex('permissions', 'by-name', name);
    return data ? Permission.fromPersistence(data) : null;
  }

  async findByResourceAndAction(resource: string, action: string): Promise<Permission | null> {
    const db = await BrowserDatabase.getInstance();
    const data = await db.getFromIndex('permissions', 'by-resource-action', [resource, action]);
    return data ? Permission.fromPersistence(data) : null;
  }

  async findAll(skip = 0, take = 10): Promise<Permission[]> {
    const db = await BrowserDatabase.getInstance();
    // IndexedDB doesn't support skip/take natively efficiently without cursors.
    // For small datasets, we can fetch all or use a cursor.
    // Using getAll for simplicity as this is a demo.
    const allData = await db.getAll('permissions');
    const sliced = allData.slice(skip, skip + take);
    return sliced.map((d) => Permission.fromPersistence(d));
  }

  async findByRoleId(roleId: string): Promise<Permission[]> {
    const db = await BrowserDatabase.getInstance();
    const role = await db.get('roles', roleId);
    if (!role || !role.permissionIds) return [];

    const permissions: Permission[] = [];
    for (const permId of role.permissionIds) {
      const permData = await db.get('permissions', permId);
      if (permData) {
        permissions.push(Permission.fromPersistence(permData));
      }
    }
    return permissions;
  }

  async findByUserId(userId: string): Promise<Permission[]> {
    const db = await BrowserDatabase.getInstance();
    const user = await db.get('users', userId);
    if (!user || !user.roleIds) return [];

    const permissionMap = new Map<string, Permission>();

    for (const roleId of user.roleIds) {
      const rolePermissions = await this.findByRoleId(roleId);
      for (const perm of rolePermissions) {
        permissionMap.set(perm.id, perm);
      }
    }

    return Array.from(permissionMap.values());
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const db = await BrowserDatabase.getInstance();
    const allData = await db.getAll('permissions');
    return allData.filter((p) => p.resource === resource).map((d) => Permission.fromPersistence(d));
  }

  async count(): Promise<number> {
    const db = await BrowserDatabase.getInstance();
    return db.count('permissions');
  }

  async update(permission: Permission): Promise<Permission> {
    return this.save(permission);
  }

  async delete(id: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    await db.delete('permissions', id);
  }

  async exists(resource: string, action: string, excludePermissionId?: string): Promise<boolean> {
    const existing = await this.findByResourceAndAction(resource, action);
    if (!existing) return false;
    if (excludePermissionId && existing.id === excludePermissionId) return false;
    return true;
  }

  async assignToRole(roleId: string, permissionId: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    const role = await db.get('roles', roleId);
    if (!role) throw new Error('Role not found');

    if (!role.permissionIds.includes(permissionId)) {
      role.permissionIds.push(permissionId);
      await db.put('roles', role);
    }
  }

  async removeFromRole(roleId: string, permissionId: string): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    const role = await db.get('roles', roleId);
    if (!role) throw new Error('Role not found');

    role.permissionIds = role.permissionIds.filter((id) => id !== permissionId);
    await db.put('roles', role);
  }

  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const db = await BrowserDatabase.getInstance();
    const role = await db.get('roles', roleId);
    if (!role) throw new Error('Role not found');

    role.permissionIds = permissionIds;
    await db.put('roles', role);
  }
}
