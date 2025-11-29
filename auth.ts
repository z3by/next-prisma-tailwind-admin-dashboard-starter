import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaUserRepository } from '@/core/infrastructure/repositories/prisma-user.repository';
import { Email } from '@/core/domain/value-objects/email';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const userRepository = new PrismaUserRepository();

          try {
            const user = await userRepository.findByEmail(Email.create(email));
            if (!user) return null;

            const passwordsMatch = await user.password.compare(password);
            if (passwordsMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email.getValue(),
              };
            }
          } catch (error) {
            console.error('Auth error:', error);
            return null;
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});
