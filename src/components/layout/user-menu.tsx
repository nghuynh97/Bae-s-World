"use client";

import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logout, globalLogout } from "@/actions/auth";

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGlobalConfirm, setShowGlobalConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isGlobalPending, startGlobalTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  function handleGlobalLogout() {
    startGlobalTransition(async () => {
      await globalLogout();
    });
  }

  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-9 h-9 rounded-full bg-accent text-text-primary font-bold text-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label="User menu"
        >
          {initial}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setShowConfirm(true)}>
            Sign Out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowGlobalConfirm(true)}>
            Sign Out All Devices
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-[10px] border border-border"
            >
              Stay Signed In
            </button>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="px-4 py-2 text-sm font-bold text-text-primary bg-accent hover:bg-accent-hover transition-colors rounded-[10px] disabled:opacity-50"
            >
              {isPending ? "Signing out..." : "Sign Out"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGlobalConfirm} onOpenChange={setShowGlobalConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out All Devices</DialogTitle>
            <DialogDescription>
              This will sign you out on all devices. You will need to log in
              again everywhere.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowGlobalConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-[10px] border border-border"
            >
              Cancel
            </button>
            <button
              onClick={handleGlobalLogout}
              disabled={isGlobalPending}
              className="px-4 py-2 text-sm font-bold text-text-primary bg-accent hover:bg-accent-hover transition-colors rounded-[10px] disabled:opacity-50"
            >
              {isGlobalPending ? "Signing out..." : "Sign Out Everywhere"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
