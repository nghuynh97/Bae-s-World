'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-xl font-bold text-text-primary">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We had trouble loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-[10px] bg-accent px-6 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-accent-hover active:scale-[0.97]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
