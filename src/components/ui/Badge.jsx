import { cn } from '@lib/cn';

const TONES = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 dark:border dark:border-brand-800/50',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/50',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 dark:border dark:border-red-800/50',
};

const Badge = ({ tone = 'neutral', className, children }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}>{children}</span>
);

export default Badge;
