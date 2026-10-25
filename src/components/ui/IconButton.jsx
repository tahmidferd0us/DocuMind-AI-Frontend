import { forwardRef } from 'react';
import { cn } from '@lib/cn';

const VARIANTS = {
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300',
  outline: 'border border-line text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
};
const SIZES = { sm: 'size-8', md: 'size-10' };

const IconButton = forwardRef(({ label, variant = 'ghost', size = 'md', className, children, ...props }, ref) => (
  <button ref={ref} type="button" aria-label={label} title={label} className={cn('inline-flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50', VARIANTS[variant], SIZES[size], className)} {...props}>
    {children}
  </button>
));

IconButton.displayName = 'IconButton';

export default IconButton;
