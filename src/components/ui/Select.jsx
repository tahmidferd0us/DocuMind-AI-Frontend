import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@lib/cn';
import FormField from './FormField';
import { inputBaseClass, inputStateClass } from './Input';

const Select = forwardRef(
  ({ id, label, hint, error, required, options = [], placeholder = 'Select an option', className, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <FormField id={selectId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            className={cn(inputBaseClass, inputStateClass(Boolean(error)), 'appearance-none pr-10', className)}
            {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
      </FormField>
    );
  },
);

Select.displayName = 'Select';

export default Select;
