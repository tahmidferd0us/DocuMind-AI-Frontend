import { cn } from '@lib/cn';

const TONES = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:border dark:border-slate-700/60',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200 dark:border dark:border-brand-700/60',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/60',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 dark:border dark:border-red-800/60',
};

const Badge = ({ tone = 'neutral', className, children }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}>{children}</span>
);

export default Badge;
