import Link from "next/link";
import { LogoText } from "@/components/layout/logo-text";

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

        {/* Login form placeholder -- Plan 02 adds the actual form */}
        <div className="mt-8 w-full rounded-[10px] border border-border p-6 bg-surface">
          <p className="text-text-secondary text-sm text-center">
            Login form coming soon
          </p>
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
