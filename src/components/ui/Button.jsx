import { forwardRef } from 'react';
import { cn } from '@lib/cn';
import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300 dark:disabled:bg-brand-900 dark:disabled:text-brand-500',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 dark:disabled:bg-red-950 dark:disabled:text-red-400',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 disabled:text-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:disabled:text-slate-600',
  outline: 'border border-line bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900 dark:border-slate-750 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-750 dark:disabled:text-slate-600',
  ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:disabled:text-slate-600',
  link: 'text-brand-600 underline-offset-4 hover:underline disabled:text-slate-400 dark:text-brand-400 dark:disabled:text-slate-600',
};

const SIZES = { sm: 'h-9 px-3 text-sm gap-1.5', md: 'h-11 px-4 text-sm gap-2', lg: 'h-12 px-6 text-base gap-2' };

const Button = forwardRef(({ variant = 'primary', size = 'md', type = 'button', isLoading = false, disabled = false, fullWidth = false, leftIcon, rightIcon, className, children, ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    className={cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed',
      VARIANTS[variant],
      SIZES[size],
      fullWidth && 'w-full',
      className,
    )}
    {...props}
  >
    {isLoading ? <Spinner size="sm" /> : leftIcon}
    {children}
    {!isLoading && rightIcon}
  </button>
));

Button.displayName = 'Button';

export default Button;
