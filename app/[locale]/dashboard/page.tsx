import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{t('title')}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded bg-white p-6 shadow">
          <h3 className="text-sm text-gray-500">Active Sessions</h3>
          <p className="text-3xl font-bold">56</p>
        </div>
        <div className="rounded bg-white p-6 shadow">
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="text-3xl font-bold">$12,345</p>
        </div>
      </div>
    </div>
  );
}
