'use client';

import { AuthService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SignInForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account.</CardDescription>
      </CardHeader>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get('email') as string;
          const password = formData.get('password') as string;

          const authService = AuthService.getInstance();
          const success = await authService.login(email, password);

          if (success) {
            window.location.href = '/dashboard';
          } else {
            // We can't easily set error message with useActionState if we bypass it.
            // For simplicity in this hybrid mode, we'll use a local state for error.
            // But wait, we can't mix useActionState easily with client-side logic if we want to keep server action for Prisma mode.
            // Actually, AuthService handles both modes.
            // So we should just use a client-side handler that calls AuthService.
            alert('Invalid credentials');
          }
        }}
      >
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
