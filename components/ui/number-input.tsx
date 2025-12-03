import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = (value || 0) + 1;
    if (newValue <= max) onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = (value || 0) - 1;
    if (newValue >= min) onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    if (val === undefined || (val >= min && val <= max)) {
      onChange(val);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || (value || 0) <= min}
        className="h-11 w-11 rounded-lg border-baby-blue-light hover:bg-baby-blue/10 transition-colors"
        aria-label="Kurangkan bilangan"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={value || ''}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="text-center h-11 w-20 border-baby-blue-light focus:border-baby-blue [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        aria-label="Bilangan orang"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || (value || 0) >= max}
        className="h-11 w-11 rounded-lg border-baby-blue-light hover:bg-baby-blue/10 transition-colors"
        aria-label="Tambahkan bilangan"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
