import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QuiltedGrid } from '@/components/portfolio/quilted-grid';

describe('QuiltedGrid', () => {
  it('renders children inside a quilted-grid container', () => {
    render(
      <QuiltedGrid>
        <div data-testid="child">Item</div>
      </QuiltedGrid>,
    );
    const child = screen.getByTestId('child');
    expect(child).toBeTruthy();
    expect(child.parentElement?.className).toContain('quilted-grid');
  });

  it('applies CSS Grid classes', () => {
    const { container } = render(
      <QuiltedGrid>
        <div>Item</div>
      </QuiltedGrid>,
    );
    const grid = container.firstElementChild!;
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-3');
  });
});
