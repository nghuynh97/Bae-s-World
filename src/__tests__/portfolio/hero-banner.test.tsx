import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeroBanner } from '@/components/portfolio/hero-banner';

const defaultProps = {
  name: 'Test',
  bio: 'Bio',
  profileImageUrl: null,
  tagline: null,
  height: null,
  weight: null,
  email: null,
  instagramUrl: null,
  tiktokUrl: null,
};

describe('HeroBanner', () => {
  it('renders name and bio', () => {
    render(<HeroBanner {...defaultProps} name="Test Name" bio="Test bio text" />);
    expect(screen.getByText('Test Name')).toBeTruthy();
    expect(screen.getByText('Test bio text')).toBeTruthy();
  });

  it('renders tagline when provided', () => {
    render(<HeroBanner {...defaultProps} tagline="Test tagline" />);
    expect(screen.getByText('Test tagline')).toBeTruthy();
  });

  it('does not render tagline when null', () => {
    const { container } = render(<HeroBanner {...defaultProps} tagline={null} />);
    // With tagline=null, no paragraph with mt-1 text-sm text-text-secondary should exist
    const taglineEl = container.querySelector('.mt-1.text-sm.text-text-secondary');
    expect(taglineEl).toBeNull();
  });

  it('displays height and weight with middle dot separator', () => {
    render(<HeroBanner {...defaultProps} height="170cm" weight="52kg" />);
    expect(screen.getByText(/170cm/)).toBeTruthy();
    expect(screen.getByText(/52kg/)).toBeTruthy();
    expect(screen.getByText(/\u00b7/)).toBeTruthy();
  });

  it('renders social links conditionally', () => {
    render(
      <HeroBanner
        {...defaultProps}
        instagramUrl="https://instagram.com/test"
        tiktokUrl={null}
        email="test@test.com"
      />,
    );
    expect(screen.getByLabelText('Instagram')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.queryByLabelText('TikTok')).toBeNull();
  });

  it('shows placeholder when profileImageUrl is null', () => {
    render(<HeroBanner {...defaultProps} name="Test" profileImageUrl={null} />);
    expect(screen.queryByRole('img', { name: /Test/ })).toBeNull();
  });
});
