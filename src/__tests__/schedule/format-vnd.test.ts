import { describe, it, expect } from 'vitest';
import { formatVND, formatVNDCompact } from '@/lib/schedule/format-vnd';

describe('formatVND', () => {
  it('formats 5,000,000 with dot separators and dong symbol', () => {
    const result = formatVND(5000000);
    expect(result).toContain('5.000.000');
    // Should contain dong symbol (either literal or Unicode)
    expect(result).toMatch(/(\u20ab|d|VND)/i);
  });

  it('formats 0 with dong symbol', () => {
    const result = formatVND(0);
    expect(result).toContain('0');
    expect(result).toMatch(/(\u20ab|d|VND)/i);
  });

  it('formats 1,500,000 correctly', () => {
    const result = formatVND(1500000);
    expect(result).toContain('1.500.000');
  });
});

describe('formatVNDCompact', () => {
  it("returns '5M' for 5,000,000", () => {
    expect(formatVNDCompact(5000000)).toBe('5M');
  });

  it("returns '500K' for 500,000", () => {
    expect(formatVNDCompact(500000)).toBe('500K');
  });

  it("returns '999' for 999", () => {
    expect(formatVNDCompact(999)).toBe('999');
  });

  it("returns '2M' for 1,500,000 (rounds)", () => {
    expect(formatVNDCompact(1500000)).toBe('2M');
  });

  it("returns '1M' for 1,000,000", () => {
    expect(formatVNDCompact(1000000)).toBe('1M');
  });

  it("returns '10K' for 10,000", () => {
    expect(formatVNDCompact(10000)).toBe('10K');
  });
});
