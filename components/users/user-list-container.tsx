'use client';

import { UserResponseDto } from '@/core/application/dtos/user.dto';
import UserTable from './user-table';
import { useEffect, useState } from 'react';
import { UserService } from '@/lib/services/user.service';

interface UserListContainerProps {
  initialUsers: UserResponseDto[];
}

export default function UserListContainer({ initialUsers }: UserListContainerProps) {
  const [users, setUsers] = useState<UserResponseDto[]>(initialUsers);
  const [loading, setLoading] = useState(process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER === 'browser');

  useEffect(() => {
    const provider = process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER;
    if (provider === 'browser') {
      UserService.getInstance()
        .getUsers()
        .then((result) => {
          setUsers(result.users);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return <UserTable users={users} />;
}
