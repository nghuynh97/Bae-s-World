import Link from "next/link";
import { LogoText } from "@/components/layout/logo-text";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-[360px]">
        <LogoText size="lg" />

        <p className="mt-4 text-text-secondary text-base text-center">
          Welcome to Funnghy&apos;s World
        </p>
        <p className="mt-2 text-text-secondary text-base text-center">
          Sign in with your email and password to continue.
        </p>

        <div className="mt-8 w-full">
          <LoginForm />
        </div>

        <Link
          href="/setup"
          className="mt-6 text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          First time? Enter your invite code
        </Link>
      </div>
    </div>
  );
}
