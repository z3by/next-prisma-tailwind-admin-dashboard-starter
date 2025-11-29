'use client';

import { UserResponseDto } from '@/core/application/dtos/user.dto';
import { useTranslations } from 'next-intl';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { deleteUser } from '@/app/actions/users';
import { useTransition } from 'react';

interface UserTableProps {
  users: UserResponseDto[];
}

export default function UserTable({ users }: UserTableProps) {
  const t = useTranslations('UserManagement');
  const tCommon = useTranslations('Common');
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm(tCommon('confirmDelete'))) {
      startTransition(async () => {
        await deleteUser(id);
      });
    }
  };

  return (
    <div className="overflow-x-auto rounded bg-white shadow">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
              {t('name')}
            </th>
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
              {t('email')}
            </th>
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
              {t('role')}
            </th>
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
              {t('status')}
            </th>
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
              {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="whitespace-no-wrap text-gray-900">{user.name || 'N/A'}</p>
                  </div>
                </div>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap text-gray-900">{user.email}</p>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <span className="relative inline-block px-3 py-1 leading-tight font-semibold text-green-900">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-green-200 opacity-50"
                  ></span>
                  <span className="relative">{user.roles.join(', ')}</span>
                </span>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <span className="relative inline-block px-3 py-1 leading-tight font-semibold text-gray-900">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-gray-200 opacity-50"
                  ></span>
                  <span className="relative">{user.status}</span>
                </span>
              </td>
              <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isPending}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
