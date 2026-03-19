import Link from "next/link";
import { LogoText } from "@/components/layout/logo-text";

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-[360px]">
        <LogoText size="lg" />

        <p className="mt-4 text-text-secondary text-base text-center">
          Set Up Your Account
        </p>

        {/* Invite code form placeholder -- Plan 02 adds the actual form */}
        <div className="mt-8 w-full rounded-[10px] border border-border p-6 bg-surface">
          <p className="text-text-secondary text-sm text-center">
            Invite code form coming soon
          </p>
        </div>

        <Link
          href="/login"
          className="mt-6 text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
