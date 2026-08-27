import { useId, useRef, useState } from 'react';
import { FilePlus2, FileText } from 'lucide-react';
import { cn } from '@lib/cn';
import { formatBytes } from '@lib/format';

const UploadDropzone = ({ onFiles, accept = [], maxSize, disabled = false, label = 'Choose files', hint = 'or drop files here', className }) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const open = () => !disabled && inputRef.current?.click();

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Choose a document to upload"
      aria-disabled={disabled || undefined}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled && event.dataTransfer.files?.length) onFiles?.(event.dataTransfer.files);
      }}
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-xl px-3 py-8 text-center transition-colors sm:px-6 sm:py-14',
        disabled ? 'cursor-not-allowed bg-brand-600/60' : 'cursor-pointer',
        !disabled && (isDragging ? 'bg-brand-700' : 'bg-brand-600 hover:bg-brand-700'),
        className,
      )}
    >
      <div className="pointer-events-none flex w-full flex-col items-center rounded-lg border-2 border-dashed border-white/45 px-3 py-8 sm:px-4 sm:py-10">
        <FileText className="size-10 text-white/90 sm:size-12" strokeWidth={1.25} />

        <span className="mt-5 inline-flex h-11 max-w-full items-center gap-2 rounded-md bg-white px-4 text-xs font-bold uppercase tracking-wide text-ink shadow-sm sm:h-12 sm:px-6 sm:text-sm">
          <FilePlus2 className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </span>

        <p className="mt-4 text-sm text-white/90">{hint}</p>
        {accept.length ? (
          <p className="mt-1 text-xs text-white/70">
            {accept.join(', ')}
            {maxSize ? ` · up to ${formatBytes(maxSize)}` : ''}
          </p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept.join(',')}
        disabled={disabled}
        onChange={(event) => {
          if (event.target.files?.length) onFiles?.(event.target.files);
          event.target.value = '';
        }}
      />
    </div>
  );
};

export default UploadDropzone;
