import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@lib/cn';
import FormField from './FormField';

export const inputBaseClass =
  'w-full rounded-lg border bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400';

export const inputStateClass = (hasError) =>
  hasError
    ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950'
    : 'border-line dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-950';

const Input = forwardRef(
  ({ id, label, hint, error, required, type = 'text', leftIcon, className, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === 'password';

    return (
      <FormField id={inputId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
        <div className="relative">
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{leftIcon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && revealed ? 'text' : type}
            required={required}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(inputBaseClass, inputStateClass(Boolean(error)), leftIcon && 'pl-10', isPassword && 'pr-11', className)}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setRevealed((value) => !value)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          ) : null}
        </div>
      </FormField>
    );
  },
);

Input.displayName = 'Input';

export default Input;
