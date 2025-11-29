import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }

  const t = await getTranslations('Dashboard');
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="mt-4">{t('welcome', { name: 'Guest' })}</p>
      <div className="mt-4">
        <Link href="/api/auth/signin" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
