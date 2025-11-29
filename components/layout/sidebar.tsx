import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users } from 'lucide-react';

export default function Sidebar() {
  const t = useTranslations('Dashboard');
  const tUsers = useTranslations('UserManagement');

  return (
    <aside className="min-h-screen w-64 bg-gray-900 p-4 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 rounded p-2 hover:bg-gray-800"
        >
          <LayoutDashboard size={20} />
          <span>{t('title')}</span>
        </Link>
        <Link
          href="/dashboard/users"
          className="flex items-center space-x-2 rounded p-2 hover:bg-gray-800"
        >
          <Users size={20} />
          <span>{tUsers('users')}</span>
        </Link>
      </nav>
    </aside>
  );
}
