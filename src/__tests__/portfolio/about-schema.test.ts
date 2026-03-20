import { describe, it, expect } from 'vitest';
import { aboutContent } from '@/lib/db/schema';

describe('aboutContent schema', () => {
  it('has tagline column', () => {
    expect(aboutContent.tagline).toBeTruthy();
  });

  it('has height column', () => {
    expect(aboutContent.height).toBeTruthy();
  });

  it('has weight column', () => {
    expect(aboutContent.weight).toBeTruthy();
  });
});
