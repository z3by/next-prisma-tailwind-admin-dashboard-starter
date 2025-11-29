import { getUsers } from '@/app/actions/users';
import UserTable from '@/components/users/user-table';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';

export default async function UsersPage() {
  const { users } = await getUsers();
  const t = await getTranslations('UserManagement');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link
          href="/dashboard/users/new"
          className="flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>{t('create')}</span>
        </Link>
      </div>
      <UserTable users={users} />
    </div>
  );
}
