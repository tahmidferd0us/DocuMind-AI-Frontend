import { forwardRef, useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@lib/cn';
import FormField from './FormField';
import { inputBaseClass, inputStateClass } from './Input';

const clamp = (value, min, max) => Math.min(Math.max(value, min ?? -Infinity), max ?? Infinity);

const NumberInput = forwardRef(
  ({ id, label, hint, error, required, value, onChange, min, max, step = 1, disabled, className, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const numericValue = Number(value);

    const nudge = (direction) => {
      const base = Number.isFinite(numericValue) ? numericValue : min ?? 0;
      onChange?.(clamp(base + direction * step, min, max));
    };

    return (
      <FormField id={inputId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={disabled || (min !== undefined && numericValue <= min)}
            aria-label="Decrease value"
            className="absolute left-1 flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <input
            ref={ref}
            id={inputId}
            type="number"
            inputMode="numeric"
            value={value ?? ''}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            required={required}
            onChange={(event) => onChange?.(event.target.value === '' ? '' : Number(event.target.value))}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              inputBaseClass,
              inputStateClass(Boolean(error)),
              'px-11 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={disabled || (max !== undefined && numericValue >= max)}
            aria-label="Increase value"
            className="absolute right-1 flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </FormField>
    );
  },
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
