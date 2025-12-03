import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from '../progress';

describe('Progress', () => {
  it('renders with correct value', () => {
    render(<Progress value={50} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('handles 0% value', () => {
    render(<Progress value={0} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('handles 100% value', () => {
    render(<Progress value={100} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles undefined value', () => {
    render(<Progress value={undefined} aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    // When value is undefined, aria-valuenow should not be set or be null
    const valueNow = progress.getAttribute('aria-valuenow');
    expect(valueNow === null || valueNow === 'null' || valueNow === '').toBe(true);
  });

  it('applies custom className', () => {
    render(<Progress value={50} className="custom-class" aria-label="Loading progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes', () => {
    render(<Progress value={50} aria-label="Upload progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-label', 'Upload progress');
  });
});
