'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/actions/auth';
import { ButtonSpinner } from '@/components/ui/button-spinner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  function onSubmit(data: LoginFormData) {
    startTransition(async () => {
      const result = await login(data.email, data.password);
      if (result?.error) {
        setError('root', { message: result.error });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={`rounded-[10px] ${errors.email ? 'border-destructive' : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive" aria-live="polite">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className={`rounded-[10px] ${errors.password ? 'border-destructive' : ''}`}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive" aria-live="polite">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-sm text-destructive" aria-live="polite">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[10px] bg-accent py-3 text-sm font-bold tracking-wider text-text-primary uppercase transition-all duration-100 hover:bg-accent-hover active:scale-[0.97] disabled:opacity-50"
      >
        <span className="inline-flex items-center gap-2">
          {isPending && <ButtonSpinner />}
          {isPending ? 'Signing in...' : 'Sign In'}
        </span>
      </button>
    </form>
  );
}
