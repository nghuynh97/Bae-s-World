import Link from 'next/link';
import { LogoText } from '@/components/layout/logo-text';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-[360px] flex-col items-center">
        <LogoText size="lg" />

        <p className="mt-4 text-center text-base text-text-secondary">
          Welcome to Funnghy&apos;s World
        </p>
        <p className="mt-2 text-center text-base text-text-secondary">
          Sign in with your email and password to continue.
        </p>

        <div className="mt-8 w-full">
          <LoginForm />
        </div>

        <Link
          href="/setup"
          className="mt-6 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          First time? Enter your invite code
        </Link>
      </div>
    </div>
  );
}
