import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

import { TopNav } from '@/components/layout/top-nav';
import { BottomTabBar } from '@/components/layout/bottom-tab-bar';

describe('Navigation', () => {
  it('top nav public links do not contain About', () => {
    render(<TopNav />);
    const links = screen.getAllByRole('link');
    const aboutLink = links.find((l) => l.textContent === 'About');
    expect(aboutLink).toBeUndefined();
  });

  it('bottom tab bar public tabs do not contain About', () => {
    render(<BottomTabBar />);
    const links = screen.getAllByRole('link');
    const aboutLink = links.find((l) => l.textContent === 'About');
    expect(aboutLink).toBeUndefined();
  });
});
