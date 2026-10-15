import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, FileText, Inbox, Search, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardHeader, ConfirmModal, Table } from '@components/ui';
import { formatBytes, formatDate } from '@lib/format';
import { DEFAULT_PAGE_SIZE } from '@lib/constants';
import { documentPath } from '@routes/paths';
import { useToast } from '@features/toast/useToast';
import { useDeleteAdminDocumentMutation, useListAdminDocumentsQuery } from '../adminApi';

const STATUS_TONES = {
  READY: 'success',
  PROCESSING: 'warning',
  FAILED: 'danger',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'READY', label: 'Ready' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'FAILED', label: 'Failed' },
];

const AdminDocumentsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data, isFetching } = useListAdminDocumentsQuery({
    page,
    limit: pageSize,
    search: search.trim(),
    status,
  });

  const [deleteDocument, { isLoading: isDeleting }] = useDeleteAdminDocumentMutation();

  const documents = data?.items ?? [];
  const meta = data?.meta;

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const result = await deleteDocument(pendingDelete.id);
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete document.');
    } else {
      toast.success(`${pendingDelete.filename} was deleted by admin.`);
    }
    setPendingDelete(null);
  };

  const columns = [
    {
      key: 'filename',
      header: 'Document',
      render: (row) => (
        <span className="flex items-center gap-2 font-medium text-slate-800 text-xs">
          <FileText className="size-4 shrink-0 text-brand-600" />
          <span className="truncate max-w-[14rem] sm:max-w-xs">{row.filename}</span>
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (row) => (
        <div className="min-w-0">
          <span className="truncate text-xs font-medium text-slate-800 block">
            {row.user?.fullName || 'User'}
          </span>
          <span className="truncate text-[11px] text-slate-500 block">{row.user?.email}</span>
        </div>
      ),
    },
    {
      key: 'pageCount',
      header: 'Pages',
      align: 'right',
      render: (row) => <span className="text-xs text-slate-600">{row.pageCount ?? '—'}</span>,
    },
    {
      key: 'wordCount',
      header: 'Words',
      align: 'right',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.wordCount ? row.wordCount.toLocaleString() : '—'}
        </span>
      ),
    },
    {
      key: 'sizeBytes',
      header: 'Size',
      align: 'right',
      render: (row) => <span className="text-xs text-slate-600">{formatBytes(row.sizeBytes)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="flex flex-col gap-1">
          <Badge tone={STATUS_TONES[row.status]} className="text-[10px]">
            {row.status}
          </Badge>
          {row.errorMessage ? (
            <span className="max-w-[14rem] truncate text-[10px] text-red-600" title={row.errorMessage}>
              {row.errorMessage}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Uploaded',
      render: (row) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status === 'READY' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(documentPath(row.id))}
              title="Open document workspace"
              className="text-slate-600 hover:text-brand-600 p-1.5"
            >
              <ExternalLink className="size-3.5" />
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setPendingDelete(row)}
            title="Delete document"
            className="text-[11px] px-2.5 py-1"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters */}
      <Card className="p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by filename or owner email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-line bg-white px-3 py-2 text-xs text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Global Documents Table */}
      <Card className="shadow-xs">
        <CardHeader
          title="Platform Documents Repository"
          description={meta ? `${meta.total} document(s) uploaded across platform` : 'Loading documents…'}
        />
        <Table
          columns={columns}
          data={documents}
          isLoading={isFetching}
          onRowClick={(row) => row.status === 'READY' && navigate(documentPath(row.id))}
          emptyIcon={<Inbox className="size-6 text-slate-400" />}
          emptyTitle="No platform documents found"
          emptyDescription="Try adjusting your search criteria or status filter."
          containerClassName="rounded-none border-0"
          pagination={
            meta
              ? {
                  page,
                  pageSize,
                  total: meta.total,
                  onPageChange: setPage,
                  onPageSizeChange: (size) => {
                    setPageSize(size);
                    setPage(1);
                  },
                }
              : undefined
          }
        />
      </Card>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Admin: Delete this document?"
        message={`"${pendingDelete?.filename ?? ''}" owned by ${
          pendingDelete?.user?.email ?? 'user'
        } will be permanently removed along with its extracted text, summaries, and Q&A history.`}
        confirmLabel="Delete Permanently"
      />
    </div>
  );
};

export default AdminDocumentsPage;
