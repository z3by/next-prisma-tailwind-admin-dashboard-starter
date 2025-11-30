import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/core/application/dtos/user.dto';
import { getUsers, createUser, updateUser, deleteUser } from '@/app/actions/users';
import { IndexedDBUserRepository } from '@/core/infrastructure/repositories/indexed-db-user.repository';
import { IndexedDBRoleRepository } from '@/core/infrastructure/repositories/indexed-db-role.repository';
import { ListUsersUseCase } from '@/core/application/use-cases/list-users.use-case';
import { CreateUserUseCase } from '@/core/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/core/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/core/application/use-cases/delete-user.use-case';
import { GetUserUseCase } from '@/core/application/use-cases/get-user.use-case';

const PROVIDER = process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER || 'prisma';

export class UserService {
  private static instance: UserService;
  private userRepo?: IndexedDBUserRepository;
  private roleRepo?: IndexedDBRoleRepository;

  private constructor() {
    if (PROVIDER === 'browser') {
      this.userRepo = new IndexedDBUserRepository();
      this.roleRepo = new IndexedDBRoleRepository();
    }
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers(page = 1, limit = 10): Promise<{ users: UserResponseDto[]; total: number }> {
    if (PROVIDER === 'browser' && this.userRepo) {
      const useCase = new ListUsersUseCase(this.userRepo);
      return useCase.execute({ page, limit });
    }
    return getUsers(page, limit);
  }

  async getUser(id: string): Promise<UserResponseDto> {
    if (PROVIDER === 'browser' && this.userRepo) {
      const useCase = new GetUserUseCase(this.userRepo);
      return useCase.execute(id);
    }
    // For Prisma, we don't have a direct server action for getting a single user exposed to client yet,
    // usually it's done in RSC. But for edit page, we might need it if we want fully client-side navigation support later.
    // However, the current Edit page fetches in RSC.
    // We will implement a server action for get user if needed, or just rely on RSC for initial load.
    // But wait, the plan says "UserEditContainer ... If browser mode, fetches user on mount".
    // So we need a way to fetch user on client for browser mode.
    // For Prisma mode, the container will accept initialUser from RSC.
    throw new Error('getUser is only supported in browser mode or via RSC');
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    if (PROVIDER === 'browser' && this.userRepo && this.roleRepo) {
      const useCase = new CreateUserUseCase(this.userRepo, this.roleRepo);
      return useCase.execute(dto);
    }
    return createUser(dto);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    if (PROVIDER === 'browser' && this.userRepo && this.roleRepo) {
      const useCase = new UpdateUserUseCase(this.userRepo, this.roleRepo);
      return useCase.execute(id, dto);
    }
    return updateUser(id, dto);
  }

  async deleteUser(id: string): Promise<void> {
    if (PROVIDER === 'browser' && this.userRepo) {
      const useCase = new DeleteUserUseCase(this.userRepo);
      await useCase.execute(id);
      return;
    }
    return deleteUser(id);
  }
}
