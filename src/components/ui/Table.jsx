import { cn } from '@lib/cn';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import Spinner from './Spinner';

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

const cellValue = (column, row, rowIndex) => (column.render ? column.render(row, rowIndex) : row[column.key] ?? '—');

const Table = ({
  columns = [],
  data = [],
  rowKey = 'id',
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyIcon,
  emptyAction,
  onRowClick,
  pagination,
  className,
  containerClassName,
}) => {
  const resolveKey = (row, index) => (typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey] ?? index);

  return (
    <div className={cn('overflow-hidden rounded-card border border-line bg-white', containerClassName)}>
      <div className="overflow-x-auto">
        <table className={cn('w-full min-w-[640px] border-collapse text-sm', className)}>
          <thead className="bg-surface-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  className={cn('whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500', alignClass[column.align ?? 'left'])}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                  <Spinner size="lg" className="text-brand-600" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={resolveKey(row, rowIndex)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn('transition-colors hover:bg-surface-muted', onRowClick && 'cursor-pointer')}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-4 py-3 text-slate-700', alignClass[column.align ?? 'left'], column.cellClassName)}>
                      {cellValue(column, row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && !isLoading && data.length > 0 ? <Pagination {...pagination} /> : null}
    </div>
  );
};

export default Table;
