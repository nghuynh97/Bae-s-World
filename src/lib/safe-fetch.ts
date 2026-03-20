/**
 * Wraps an async function to catch errors and return a fallback value.
 * Use in Server Components to prevent page crashes from DB/API failures.
 *
 * Usage:
 *   const data = await safeFetch(() => getPortfolioItems(), { items: [], nextCursor: null });
 */
export async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('[safeFetch] Error:', error);
    return fallback;
  }
}
