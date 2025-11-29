import UserForm from '@/components/users/user-form';
import { getTranslations } from 'next-intl/server';
import { PrismaUserRepository } from '@/core/infrastructure/repositories/prisma-user.repository';
import { notFound } from 'next/navigation';
import { GetUserUseCase } from '@/core/application/use-cases/get-user.use-case';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations('UserManagement');
  const userRepository = new PrismaUserRepository();
  const useCase = new GetUserUseCase(userRepository);

  let user;
  try {
    user = await useCase.execute(id);
  } catch (e) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('edit')}</h1>
      <UserForm user={user} />
    </div>
  );
}
