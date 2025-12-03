import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from '../number-input';

describe('NumberInput', () => {
  it('increments value when plus button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={1} onChange={onChange} />);

    await user.click(screen.getByLabelText('Tambahkan bilangan'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements value when minus button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={2} onChange={onChange} min={1} />);

    await user.click(screen.getByLabelText('Kurangkan bilangan'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('respects min/max bounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(<NumberInput value={1} onChange={onChange} min={1} max={5} />);

    // Try to go below min
    await user.click(screen.getByLabelText('Kurangkan bilangan'));
    expect(onChange).not.toHaveBeenCalled();

    // Set to max
    onChange.mockClear();
    rerender(<NumberInput value={5} onChange={onChange} min={1} max={5} />);

    // Try to go above max
    await user.click(screen.getByLabelText('Tambahkan bilangan'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles direct input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={undefined} onChange={onChange} min={1} max={10} />);

    const input = screen.getByLabelText('Bilangan orang');
    await user.type(input, '5');

    // Check that onChange was called with 5
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('prevents invalid input outside bounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NumberInput value={5} onChange={onChange} min={1} max={10} />);

    const input = screen.getByLabelText('Bilangan orang');
    await user.clear(input);
    await user.type(input, '15');

    // Should not call onChange with value outside bounds
    const calls = onChange.mock.calls;
    const hasInvalidCall = calls.some(call => call[0] > 10);
    expect(hasInvalidCall).toBe(false);
  });

  it('disables buttons when disabled prop is true', () => {
    render(<NumberInput value={5} onChange={vi.fn()} disabled={true} />);

    expect(screen.getByLabelText('Tambahkan bilangan')).toBeDisabled();
    expect(screen.getByLabelText('Kurangkan bilangan')).toBeDisabled();
    expect(screen.getByLabelText('Bilangan orang')).toBeDisabled();
  });

  it('handles empty value', () => {
    const onChange = vi.fn();
    render(<NumberInput value={undefined} onChange={onChange} />);

    const input = screen.getByLabelText('Bilangan orang');
    expect(input).toHaveValue(null); // Empty input has null value
  });
});
