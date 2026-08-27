import { forwardRef, useId } from 'react';
import { cn } from '@lib/cn';
import FormField from './FormField';
import { inputBaseClass, inputStateClass } from './Input';

const Textarea = forwardRef(({ id, label, hint, error, required, rows = 4, className, containerClassName, ...props }, ref) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <FormField id={textareaId} label={label} hint={hint} error={error} required={required} className={containerClassName}>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        className={cn(inputBaseClass, inputStateClass(Boolean(error)), 'resize-y', className)}
        {...props}
      />
    </FormField>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
