'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { createUser, updateUser } from '@/app/actions/users';
import { UserResponseDto } from '@/core/application/dtos/user.dto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character'
    )
    .optional(),
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
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" {...register('email')} />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {tCommon('cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? tCommon('loading') : tCommon('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
