import { getUsers } from '@/app/actions/users';
import UserTable from '@/components/users/user-table';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function UsersPage() {
  const { users } = await getUsers();
  const t = await getTranslations('UserManagement');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('create')}
          </Link>
        </Button>
      </div>
      <UserTable users={users} />
    </div>
  );
}
