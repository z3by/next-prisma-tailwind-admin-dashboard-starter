'use server';

import { signOut, signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function signInAction(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
