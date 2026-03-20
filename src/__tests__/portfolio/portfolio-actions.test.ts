import { describe, it } from 'vitest';

describe('Portfolio Server Actions', () => {
  describe('getPortfolioItems', () => {
    it.todo('returns items with nextCursor for pagination');
    it.todo('filters by category slug');
    it.todo('does not require authentication');
  });
  describe('createPortfolioItem', () => {
    it.todo('creates item when authenticated');
    it.todo('throws Unauthorized when not authenticated');
    it.todo('boyfriend can upload portfolio items');
  });
  describe('updatePortfolioItem', () => {
    it.todo('updates item when authenticated');
    it.todo('throws Unauthorized when not authenticated');
  });
  describe('deletePortfolioItem', () => {
    it.todo('deletes item and associated images when authenticated');
    it.todo('throws Unauthorized when not authenticated');
  });
  describe('getPortfolioItemById', () => {
    it.todo('returns item by ID with category and variants');
    it.todo('returns null for non-existent ID');
  });
});
