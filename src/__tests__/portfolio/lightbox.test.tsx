import { describe, it } from 'vitest';

describe('Lightbox', () => {
  describe('open and close', () => {
    it.todo('renders when open is true');
    it.todo('does not render when open is false');
    it.todo('calls onOpenChange(false) when close button clicked');
  });
  describe('navigation', () => {
    it.todo('calls onNavigate with next index on right arrow click');
    it.todo('calls onNavigate with prev index on left arrow click');
    it.todo('hides prev arrow on first item');
    it.todo('hides next arrow on last item');
    it.todo('navigates forward on ArrowRight keydown');
    it.todo('navigates backward on ArrowLeft keydown');
    it.todo('closes on Escape keydown');
  });
});
