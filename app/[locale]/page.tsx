import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { redirect } from '@/i18n/routing';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (session) {
    redirect({ href: '/dashboard', locale });
  }

  const t = await getTranslations('Dashboard');

  return (
    <div className="from-background to-muted flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-4">
      <div className="bg-grid-black/[0.02] dark:bg-grid-white/[0.02] absolute inset-0 -z-10" />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary/10 rounded-full p-3">
              <LayoutDashboard className="text-primary h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <CardDescription>{t('welcome', { name: 'Guest' })}</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center">
          <p>
            Welcome to the modern admin dashboard. Please sign in to access your account and manage
            your data.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" size="lg">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
