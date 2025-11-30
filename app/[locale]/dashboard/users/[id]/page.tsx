import UserEditContainer from '@/components/users/user-edit-container';
import { getTranslations } from 'next-intl/server';
import { PrismaUserRepository } from '@/core/infrastructure/repositories/prisma-user.repository';
import { notFound } from 'next/navigation';
import { GetUserUseCase } from '@/core/application/use-cases/get-user.use-case';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations('UserManagement');

  let user;

  // Only fetch on server if NOT using browser storage
  if (process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER !== 'browser') {
    const userRepository = new PrismaUserRepository();
    const useCase = new GetUserUseCase(userRepository);
    try {
      user = await useCase.execute(id);
    } catch {
      notFound();
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('edit')}</h1>
      <UserEditContainer userId={id} initialUser={user} />
    </div>
  );
}
