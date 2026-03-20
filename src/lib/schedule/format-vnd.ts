const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

/**
 * Format a VND amount with dot separators and dong symbol.
 * Example: formatVND(5000000) => "5.000.000 ₫"
 */
export function formatVND(amount: number): string {
  return vndFormatter.format(amount);
}

/**
 * Compact VND format for calendar cells and tight spaces.
 * Example: formatVNDCompact(5000000) => "5M", formatVNDCompact(500000) => "500K"
 */
export function formatVNDCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)}M`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}K`;
  }
  return String(amount);
}
