import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PublicTemplate from '@/app/(public)/template';
import PrivateTemplate from '@/app/(private)/template';
import AuthTemplate from '@/app/(auth)/template';

describe('Page fade animation', () => {
  it('public template renders children with fade-in class', () => {
    const { container } = render(
      <PublicTemplate>
        <p>test</p>
      </PublicTemplate>,
    );
    expect(container.firstChild).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain(
      'motion-safe:animate-page-fade-in',
    );
    expect(screen.getByText('test')).toBeTruthy();
  });

  it('private template renders children with fade-in class', () => {
    const { container } = render(
      <PrivateTemplate>
        <p>test</p>
      </PrivateTemplate>,
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      'motion-safe:animate-page-fade-in',
    );
  });

  it('auth template renders children with fade-in class', () => {
    const { container } = render(
      <AuthTemplate>
        <p>test</p>
      </AuthTemplate>,
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      'motion-safe:animate-page-fade-in',
    );
  });
});
