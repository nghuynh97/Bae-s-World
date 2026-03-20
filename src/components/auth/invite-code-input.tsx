'use client';

import { useState, useRef, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { validateInviteCode } from '@/actions/auth';

interface InviteCodeInputProps {
  onValid: (code: string, name: string) => void;
}

export function InviteCodeInput({ onValid }: InviteCodeInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(value);
    setError(null);

    if (value.length === 6) {
      startTransition(async () => {
        const result = await validateInviteCode(value);
        if (result.valid) {
          onValid(value, result.name);
        } else {
          setError(result.error);
          setCode('');
          inputRef.current?.focus();
        }
      });
    }
  }

  return (
    <div className="w-full space-y-3">
      <Input
        ref={inputRef}
        type="text"
        maxLength={6}
        value={code}
        onChange={handleChange}
        placeholder="Enter code"
        disabled={isPending}
        className="rounded-[10px] text-center font-mono text-lg tracking-wider"
        aria-label="Invite code"
      />
      {error && (
        <p className="text-center text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      {isPending && (
        <p className="text-center text-sm text-text-secondary">
          Checking code...
        </p>
      )}
    </div>
  );
}
