import { signIn, signOut } from 'next-auth/react';
import { IndexedDBUserRepository } from '@/core/infrastructure/repositories/indexed-db-user.repository';
import { Email } from '@/core/domain/value-objects/email';

const PROVIDER = process.env.NEXT_PUBLIC_REPOSITORY_PROVIDER || 'prisma';

export class AuthService {
  private static instance: AuthService;
  private userRepo?: IndexedDBUserRepository;

  private constructor() {
    if (PROVIDER === 'browser') {
      this.userRepo = new IndexedDBUserRepository();
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<boolean> {
    if (PROVIDER === 'browser' && this.userRepo) {
      try {
        const user = await this.userRepo.findByEmail(Email.create(email));
        if (!user) return false;

        const isValid = await user.password.compare(password);
        if (isValid) {
          // Set a fake session flag
          localStorage.setItem('browser_session', 'true');
          localStorage.setItem('browser_user_id', user.id);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Browser login error:', error);
        return false;
      }
    }

    // Prisma mode: use next-auth
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return !result?.error;
  }

  async logout(): Promise<void> {
    if (PROVIDER === 'browser') {
      localStorage.removeItem('browser_session');
      localStorage.removeItem('browser_user_id');
      window.location.href = '/auth/signin';
      return;
    }
    await signOut({ callbackUrl: '/auth/signin' });
  }

  isAuthenticated(): boolean {
    if (PROVIDER === 'browser') {
      if (typeof window === 'undefined') return false;
      return localStorage.getItem('browser_session') === 'true';
    }
    // For Prisma mode, we rely on useSession hook in components or server session
    return false; // This method is mainly for browser mode checks
  }
}
