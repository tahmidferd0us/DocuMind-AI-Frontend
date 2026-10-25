import { cn } from '@lib/cn';

const Card = ({ className, children, ...props }) => (
  <div className={cn('rounded-card border border-line bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm', className)} {...props}>{children}</div>
);

export const CardHeader = ({ title, description, action, className }) => (
  <div className={cn('flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6', className)}>
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
    {action}
  </div>
);

export const CardBody = ({ className, children }) => <div className={cn('p-4 sm:p-6', className)}>{children}</div>;

export default Card;
