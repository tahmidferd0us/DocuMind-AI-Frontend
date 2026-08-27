import { cn } from '@lib/cn';

const FormField = ({ id, label, hint, error, required = false, className, children }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {label ? (
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
    ) : null}
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600">
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-xs text-slate-500">
        {hint}
      </p>
    ) : null}
  </div>
);

export default FormField;
