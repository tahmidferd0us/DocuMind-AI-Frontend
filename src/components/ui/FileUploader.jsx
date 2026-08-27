import { useId, useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { cn } from '@lib/cn';
import { formatBytes } from '@lib/format';
import FormField from './FormField';
import IconButton from './IconButton';

const DEFAULT_ACCEPT = ['.pdf', '.docx', '.txt'];
const DEFAULT_MAX_SIZE = 20 * 1024 * 1024;

const extensionOf = (name) => `.${name.split('.').pop()?.toLowerCase() ?? ''}`;

export const validateFiles = (files, { accept, maxSize }) => {
  const accepted = [];
  const errors = [];
  for (const file of files) {
    if (accept?.length && !accept.includes(extensionOf(file.name))) errors.push(`${file.name}: only ${accept.join(', ')} files are allowed`);
    else if (maxSize && file.size > maxSize) errors.push(`${file.name}: exceeds the ${formatBytes(maxSize)} limit`);
    else accepted.push(file);
  }
  return { accepted, errors };
};

const FileUploader = ({
  id,
  label = 'Upload document',
  hint,
  error,
  value = [],
  onChange,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  multiple = false,
  disabled = false,
  progress,
  className,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localErrors, setLocalErrors] = useState([]);

  const applyFiles = (fileList) => {
    const { accepted, errors } = validateFiles(Array.from(fileList), { accept, maxSize });
    setLocalErrors(errors);
    if (accepted.length) onChange?.(multiple ? [...value, ...accepted] : accepted.slice(0, 1));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled && event.dataTransfer.files?.length) applyFiles(event.dataTransfer.files);
  };

  const removeAt = (index) => onChange?.(value.filter((_, position) => position !== index));

  return (
    <FormField id={inputId} label={label} hint={hint} error={error ?? localErrors[0]} className={className}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-4 py-8 text-center transition-colors sm:py-10',
          isDragging ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface-muted hover:border-brand-300 hover:bg-brand-50/40',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <UploadCloud className={cn('size-8', isDragging ? 'text-brand-600' : 'text-slate-400')} />
        <p className="text-sm font-medium text-slate-700">
          <span className="text-brand-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500">
          {accept.join(', ')} · max {formatBytes(maxSize)}
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept.join(',')}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files?.length) applyFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {value.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {value.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2">
              <FileText className="size-5 shrink-0 text-brand-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                {typeof progress === 'number' ? (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-600 transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
                  </div>
                ) : null}
              </div>
              <IconButton label={`Remove ${file.name}`} variant="danger" size="sm" onClick={() => removeAt(index)} disabled={disabled}>
                <X className="size-4" />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : null}

      {localErrors.length > 1 ? (
        <ul className="mt-2 flex flex-col gap-1">
          {localErrors.slice(1).map((message) => (
            <li key={message} className="text-xs font-medium text-red-600">
              {message}
            </li>
          ))}
        </ul>
      ) : null}
    </FormField>
  );
};

export default FileUploader;
