import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('ButtonSpinner', () => {
  it('renders a spinning loader icon', async () => {
    try {
      const { ButtonSpinner } = await import('@/components/ui/button-spinner');
      const { container } = render(<ButtonSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.classList.toString()).toContain('animate-spin');
    } catch {
      expect.fail('Module not found -- implement feature first');
    }
  });

  it('accepts additional className', async () => {
    try {
      const { ButtonSpinner } = await import('@/components/ui/button-spinner');
      const { container } = render(<ButtonSpinner className="text-red-500" />);
      const svg = container.querySelector('svg');
      expect(svg?.classList.toString()).toContain('text-red-500');
    } catch {
      expect.fail('Module not found -- implement feature first');
    }
  });

  it('has aria-hidden for accessibility', async () => {
    try {
      const { ButtonSpinner } = await import('@/components/ui/button-spinner');
      const { container } = render(<ButtonSpinner />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    } catch {
      expect.fail('Module not found -- implement feature first');
    }
  });
});
