'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { createUser, updateUser } from '@/app/actions/users';
import { UserResponseDto } from '@/core/application/dtos/user.dto';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
});

type FormData = z.infer<typeof schema>;

interface UserFormProps {
  user?: UserResponseDto;
}

export default function UserForm({ user }: UserFormProps) {
  const t = useTranslations('UserManagement');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        if (user) {
          await updateUser(user.id, data);
        } else {
          if (!data.password) return; // Password required for create
          await createUser({ ...data, password: data.password });
        }
        router.push('/dashboard/users');
      } catch (error) {
        console.error(error);
        alert('An error occurred');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg rounded bg-white p-6 shadow">
      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">{t('name')}</label>
        <input
          {...register('name')}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        />
        {errors.name && <p className="text-xs text-red-500 italic">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">{t('email')}</label>
        <input
          {...register('email')}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
        />
        {errors.email && <p className="text-xs text-red-500 italic">{errors.email.message}</p>}
      </div>

      {!user && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
          <input
            type="password"
            {...register('password')}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {errors.password && (
            <p className="text-xs text-red-500 italic">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          {isPending ? tCommon('loading') : tCommon('save')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
        >
          {tCommon('cancel')}
        </button>
      </div>
    </form>
  );
}
