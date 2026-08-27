import { cn } from '@lib/cn';

const EmptyState = ({ icon, title = 'Nothing here yet', description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
    {icon ? <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">{icon}</div> : null}
    <div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {description ? <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
    </div>
    {action}
  </div>
);

export default EmptyState;
