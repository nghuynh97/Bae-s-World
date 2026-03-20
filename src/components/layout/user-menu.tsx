'use client';

import { useState, useTransition } from 'react';
import { logout } from '@/actions/auth';
import { ButtonSpinner } from '@/components/ui/button-spinner';

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-text-primary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
        aria-label="Sign out"
      >
        {initial}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-xs"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative z-50 mx-4 w-full max-w-sm rounded-xl bg-background p-4 shadow-lg ring-1 ring-foreground/10">
            <h2 className="text-base font-medium">Sign Out</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to sign out?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-[10px] border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                Stay Signed In
              </button>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="rounded-[10px] bg-accent px-4 py-2 text-sm font-bold text-text-primary transition-all duration-100 hover:bg-accent-hover active:scale-[0.97] disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-2">
                  {isPending && <ButtonSpinner />}
                  {isPending ? 'Signing out...' : 'Sign Out'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
