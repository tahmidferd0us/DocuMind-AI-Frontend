import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';
import { PAGE_SIZE_OPTIONS } from '@lib/constants';

export const buildPageRange = (current, totalPages, siblings = 1) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const left = Math.max(2, current - siblings);
  const right = Math.min(totalPages - 1, current + siblings);
  return [1, left > 2 ? 'left-ellipsis' : null, ...Array.from({ length: right - left + 1 }, (_, index) => left + index), right < totalPages - 1 ? 'right-ellipsis' : null, totalPages].filter(Boolean);
};

const Pagination = ({ page = 1, pageSize = 10, total = 0, onPageChange, onPageSizeChange, className }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className={cn('flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-xs text-slate-500 sm:text-sm">
          Showing <span className="font-medium text-slate-700">{from}</span>–<span className="font-medium text-slate-700">{to}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span>
        </p>
        {onPageSizeChange ? (
          <label className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            Rows
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-md border border-line bg-white px-2 py-1 text-xs text-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:text-sm"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex size-9 items-center justify-center rounded-md border border-line text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {buildPageRange(page, totalPages).map((entry) =>
          typeof entry === 'number' ? (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange?.(entry)}
              aria-current={entry === page ? 'page' : undefined}
              className={cn(
                'hidden size-9 items-center justify-center rounded-md border text-sm transition-colors sm:flex',
                entry === page ? 'border-brand-600 bg-brand-600 font-medium text-white' : 'border-line text-slate-600 hover:bg-slate-50',
              )}
            >
              {entry}
            </button>
          ) : (
            <span key={entry} className="hidden size-9 items-center justify-center text-sm text-slate-400 sm:flex">
              …
            </span>
          ),
        )}

        <span className="px-2 text-sm text-slate-600 sm:hidden">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex size-9 items-center justify-center rounded-md border border-line text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
