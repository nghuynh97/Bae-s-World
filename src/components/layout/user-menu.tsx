'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-text-primary focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
        aria-label="Sign out"
      >
        {initial}
      </button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Stay Signed In
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isPending}
              className="active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                {isPending && <ButtonSpinner />}
                {isPending ? 'Signing out...' : 'Sign Out'}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
