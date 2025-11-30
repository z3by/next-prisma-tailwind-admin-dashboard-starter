import { getUsers } from '@/app/actions/users';
import UserListContainer from '@/components/users/user-list-container';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { UserResponseDto } from '@/core/application/dtos/user.dto';

export default async function UsersPage() {
  let users: UserResponseDto[] = [];

  // Only fetch on server if NOT using browser storage
  if (process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER !== 'browser') {
    const result = await getUsers();
    users = result.users;
  }

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
      <UserListContainer initialUsers={users} />
    </div>
  );
}
