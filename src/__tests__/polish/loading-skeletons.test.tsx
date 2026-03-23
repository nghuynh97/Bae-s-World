import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Loading skeletons', () => {
  it('public portfolio loading skeleton renders Skeleton components', async () => {
    try {
      const { default: Loading } = await import('@/app/(public)/loading');
      const { container } = render(<Loading />);
      const skeletons = container.querySelectorAll(
        "[data-slot='skeleton'], .animate-pulse",
      );
      expect(skeletons.length).toBeGreaterThan(0);
    } catch {
      expect.fail('Module not found -- implement feature first');
    }
  });

  it('beauty loading skeleton renders Skeleton components', async () => {
    try {
      const { default: Loading } =
        await import('@/app/(private)/beauty/[[...tab]]/loading');
      const { container } = render(<Loading />);
      const skeletons = container.querySelectorAll(
        "[data-slot='skeleton'], .animate-pulse",
      );
      expect(skeletons.length).toBeGreaterThan(0);
    } catch {
      expect.fail('Module not found -- implement feature first');
    }
  });

  it('schedule loading skeleton exists', async () => {
    try {
      const { default: Loading } =
        await import('@/app/(private)/schedule/loading');
      const { container } = render(<Loading />);
      const skeletons = container.querySelectorAll(
        "[data-slot='skeleton'], .animate-pulse",
      );
      expect(skeletons.length).toBeGreaterThan(0);
    } catch {
      expect.fail('Module not found -- implement feature first');
    }
  });
});
