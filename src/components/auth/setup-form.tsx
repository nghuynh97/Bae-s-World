'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setupAccount } from '@/actions/auth';
import { ButtonSpinner } from '@/components/ui/button-spinner';

const setupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SetupFormData = z.infer<typeof setupSchema>;

interface SetupFormProps {
  code: string;
  assignedName: string;
}

export function SetupForm({ code, assignedName }: SetupFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
  });

  function onSubmit(data: SetupFormData) {
    startTransition(async () => {
      const result = await setupAccount(code, data.email, data.password);
      if (result?.error) {
        setError('root', { message: result.error });
      }
    });
  }

  return (
    <div className="w-full">
      <h2 className="mb-6 text-center font-display text-2xl font-bold text-text-primary">
        Welcome, {assignedName}!
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="setup-email">Email</Label>
          <Input
            id="setup-email"
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
          <Label htmlFor="setup-password">Password</Label>
          <Input
            id="setup-password"
            type="password"
            placeholder="At least 8 characters"
            className={`rounded-[10px] ${errors.password ? 'border-destructive' : ''}`}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive" aria-live="polite">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="setup-confirm">Confirm Password</Label>
          <Input
            id="setup-confirm"
            type="password"
            placeholder="Confirm your password"
            className={`rounded-[10px] ${errors.confirmPassword ? 'border-destructive' : ''}`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive" aria-live="polite">
              {errors.confirmPassword.message}
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
            {isPending ? 'Creating account...' : 'Create My Account'}
          </span>
        </button>
      </form>
    </div>
  );
}
