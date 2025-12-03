import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CountdownTimer } from '../countdown-timer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders countdown with correct time units', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 day
    render(<CountdownTimer targetDate={futureDate} />);

    expect(screen.getByText(/hari/i)).toBeInTheDocument();
    expect(screen.getByText(/jam/i)).toBeInTheDocument();
    expect(screen.getByText(/minit/i)).toBeInTheDocument();
    expect(screen.getByText(/saat/i)).toBeInTheDocument();
  });

  it('updates every second', () => {
    const futureDate = new Date(Date.now() + 10000).toISOString(); // +10 seconds

    render(<CountdownTimer targetDate={futureDate} />);

    // Force mount
    act(() => {
      vi.runOnlyPendingTimers();
    });

    const initialContent = screen.getByRole('timer').textContent;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const updatedContent = screen.getByRole('timer').textContent;
    expect(updatedContent).not.toBe(initialContent);
  });

  it('shows event started message when time reaches zero', () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();

    render(<CountdownTimer targetDate={pastDate} />);

    // Force mount
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText(/majlis telah bermula/i)).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const futureDate = new Date(Date.now() + 10000).toISOString();
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = render(<CountdownTimer targetDate={futureDate} />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('has accessible attributes', () => {
    const futureDate = new Date(Date.now() + 10000).toISOString();

    render(<CountdownTimer targetDate={futureDate} />);

    // Force mount
    act(() => {
      vi.runOnlyPendingTimers();
    });

    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-live', 'polite');
    expect(timer).toHaveAttribute('aria-label', 'Countdown to event');
  });
});
