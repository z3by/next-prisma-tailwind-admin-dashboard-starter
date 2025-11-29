'use server';

import { PrismaUserRepository } from '@/core/infrastructure/repositories/prisma-user.repository';
import { PrismaRoleRepository } from '@/core/infrastructure/repositories/prisma-role.repository';
import { ListUsersUseCase } from '@/core/application/use-cases/list-users.use-case';
import { CreateUserUseCase } from '@/core/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/core/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/core/application/use-cases/delete-user.use-case';
import { CreateUserDto, UpdateUserDto } from '@/core/application/dtos/user.dto';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

const userRepository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();

export async function getUsers(page = 1, limit = 10) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const useCase = new ListUsersUseCase(userRepository);
  return useCase.execute({ page, limit });
}

export async function createUser(dto: CreateUserDto) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const useCase = new CreateUserUseCase(userRepository, roleRepository);
  const user = await useCase.execute(dto);
  revalidatePath('/[locale]/dashboard/users', 'page');
  return user;
}

export async function updateUser(id: string, dto: UpdateUserDto) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const useCase = new UpdateUserUseCase(userRepository, roleRepository);
  const user = await useCase.execute(id, dto);
  revalidatePath('/[locale]/dashboard/users', 'page');
  return user;
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  const useCase = new DeleteUserUseCase(userRepository);
  await useCase.execute(id);
  revalidatePath('/[locale]/dashboard/users', 'page');
}
