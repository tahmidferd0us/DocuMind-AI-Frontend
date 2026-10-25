import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@lib/cn';
import { useTheme } from '@lib/theme';

export const ThemeToggle = ({ className, showLabel = false, size = 'md' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const sizeClasses = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-11' : 'size-9 sm:size-10';
  const iconSize = size === 'sm' ? 'size-4' : 'size-4.5';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-lg border border-line bg-white/80 dark:bg-slate-850 text-slate-700 dark:text-slate-200 transition-colors hover:bg-surface-muted dark:hover:bg-slate-800 dark:border-slate-750 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        showLabel ? 'h-9 sm:h-10 px-3 gap-2' : sizeClasses,
        className,
      )}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -30, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 30, scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center justify-center"
      >
        {isDark ? (
          <Sun className={cn(iconSize, 'text-amber-400 group-hover:rotate-45 transition-transform')} />
        ) : (
          <Moon className={cn(iconSize, 'text-slate-600 group-hover:text-brand-600 group-hover:-rotate-12 transition-all')} />
        )}
      </motion.span>

      {showLabel && (
        <span className="text-xs font-medium">
          {isDark ? 'Light mode' : 'Dark mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
