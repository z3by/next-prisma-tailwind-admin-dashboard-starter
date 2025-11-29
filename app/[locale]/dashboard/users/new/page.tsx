import UserForm from '@/components/users/user-form';
import { useTranslations } from 'next-intl';

export default function CreateUserPage() {
  const t = useTranslations('UserManagement');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('create')}</h1>
      <UserForm />
    </div>
  );
}
