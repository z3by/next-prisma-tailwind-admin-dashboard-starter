import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { PermissionProps } from '@/core/domain/entities/permission.entity';
import { RoleProps } from '@/core/domain/entities/role.entity';
import { UserProps } from '@/core/domain/entities/user.entity';

export interface AdminDashboardDB extends DBSchema {
  permissions: {
    key: string;
    value: PermissionProps;
    indexes: { 'by-name': string; 'by-resource-action': [string, string] };
  };
  roles: {
    key: string;
    value: Omit<RoleProps, 'permissions'> & { permissionIds: string[] };
    indexes: { 'by-name': string };
  };
  users: {
    key: string;
    value: Omit<UserProps, 'roles' | 'email' | 'password'> & {
      roleIds: string[];
      email: string;
      password: string;
    };
    indexes: { 'by-email': string };
  };
}

const DB_NAME = 'admin-dashboard-db';
const DB_VERSION = 1;

export class BrowserDatabase {
  private static instance: Promise<IDBPDatabase<AdminDashboardDB>>;

  static async reset(): Promise<void> {
    if (this.instance) {
      const db = await this.instance;
      db.close();
      this.instance = undefined as unknown as Promise<IDBPDatabase<AdminDashboardDB>>;
    }
  }

  static async getInstance(): Promise<IDBPDatabase<AdminDashboardDB>> {
    if (!this.instance) {
      this.instance = openDB<AdminDashboardDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Permissions Store
          if (!db.objectStoreNames.contains('permissions')) {
            const permissionStore = db.createObjectStore('permissions', {
              keyPath: 'id',
            });
            permissionStore.createIndex('by-name', 'name', { unique: true });
            permissionStore.createIndex('by-resource-action', ['resource', 'action'], {
              unique: true,
            });
          }

          // Roles Store
          if (!db.objectStoreNames.contains('roles')) {
            const roleStore = db.createObjectStore('roles', {
              keyPath: 'id',
            });
            roleStore.createIndex('by-name', 'name', { unique: true });
          }

          // Users Store
          if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', {
              keyPath: 'id',
            });
            userStore.createIndex('by-email', 'email', { unique: true });
          }
        },
      });
    }
    return this.instance;
  }
}
