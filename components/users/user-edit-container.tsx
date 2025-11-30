'use client';

import { UserResponseDto } from '@/core/application/dtos/user.dto';
import UserForm from './user-form';
import { useEffect, useState } from 'react';
import { UserService } from '@/lib/services/user.service';

interface UserEditContainerProps {
  initialUser?: UserResponseDto;
  userId: string;
}

export default function UserEditContainer({ initialUser, userId }: UserEditContainerProps) {
  const [user, setUser] = useState<UserResponseDto | undefined>(initialUser);
  const [loading, setLoading] = useState(
    process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER === 'browser' && !initialUser
  );

  useEffect(() => {
    const provider = process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER;
    if (provider === 'browser' && !initialUser) {
      UserService.getInstance()
        .getUser(userId)
        .then((result) => {
          setUser(result);
        })
        .catch((err) => {
          console.error('Failed to fetch user', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId, initialUser]);

  if (loading) {
    return <div>Loading user...</div>;
  }

  return <UserForm user={user} />;
}
