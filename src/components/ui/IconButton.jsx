import { forwardRef } from 'react';
import { cn } from '@lib/cn';

const VARIANTS = { ghost: 'text-slate-600 hover:bg-slate-100', danger: 'text-red-600 hover:bg-red-50', outline: 'border border-line text-slate-600 hover:bg-slate-50' };
const SIZES = { sm: 'size-8', md: 'size-10' };

const IconButton = forwardRef(({ label, variant = 'ghost', size = 'md', className, children, ...props }, ref) => (
  <button ref={ref} type="button" aria-label={label} title={label} className={cn('inline-flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50', VARIANTS[variant], SIZES[size], className)} {...props}>
    {children}
  </button>
));

IconButton.displayName = 'IconButton';

export default IconButton;
