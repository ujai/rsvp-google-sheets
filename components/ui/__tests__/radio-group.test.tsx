import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '../radio-group';

describe('RadioGroup', () => {
  it('renders all radio options', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" aria-label="Hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" aria-label="Tidak Hadir" />
      </RadioGroup>
    );

    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('allows single selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <RadioGroup onValueChange={onChange}>
        <div>
          <RadioGroupItem value="hadir" id="hadir" />
          <label htmlFor="hadir">Hadir</label>
        </div>
        <div>
          <RadioGroupItem value="tidak_hadir" id="tidak_hadir" />
          <label htmlFor="tidak_hadir">Tidak Hadir</label>
        </div>
      </RadioGroup>
    );

    await user.click(screen.getByLabelText('Hadir'));
    expect(onChange).toHaveBeenCalledWith('hadir');
  });

  it('is keyboard navigable', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" aria-label="Hadir" />
        <RadioGroupItem value="tidak_hadir" id="tidak_hadir" aria-label="Tidak Hadir" />
      </RadioGroup>
    );

    const firstRadio = screen.getAllByRole('radio')[0];
    firstRadio.focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('radio')[1]).toHaveFocus();
  });

  it('supports disabled state', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="hadir" id="hadir" aria-label="Hadir" disabled />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });
});
