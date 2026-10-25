import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Inbox, Search, User } from 'lucide-react';

import { Badge, Button, Card, CardBody, CardHeader, ConfirmModal, Select, Table, UploadDropzone } from '@components/ui';
import { formatBytes, formatDate } from '@lib/format';
import { DEFAULT_PAGE_SIZE } from '@lib/constants';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from '@lib/tools';
import { PATHS, documentPath } from '@routes/paths';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { useDocumentIntake } from '@features/upload/useDocumentIntake';
import { useDeleteDocumentMutation, useListDocumentsQuery } from '@features/documents/documentsApi';

const STATUS_TONES = { READY: 'success', PROCESSING: 'warning', FAILED: 'danger' };

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'READY', label: 'Ready' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'FAILED', label: 'Failed' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { onFiles, isUploading } = useDocumentIntake();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data, isFetching } = useListDocumentsQuery({
    page,
    limit: pageSize,
    search: search.trim(),
    status,
  });
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const documents = data?.items ?? [];
  const meta = data?.meta;

  const columns = [
    {
      key: 'filename',
      header: 'Document',
      render: (row) => (
        <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
          <FileText className="size-4 shrink-0 text-brand-600 dark:text-brand-400" />
          <span className="truncate">{row.filename}</span>
        </span>
      ),
    },
    { key: 'pageCount', header: 'Pages', align: 'right', render: (row) => row.pageCount ?? '—' },
    { key: 'wordCount', header: 'Words', align: 'right', render: (row) => (row.wordCount ? row.wordCount.toLocaleString() : '—') },
    { key: 'sizeBytes', header: 'Size', align: 'right', render: (row) => formatBytes(row.sizeBytes) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className="flex flex-col gap-1">
          <Badge tone={STATUS_TONES[row.status]}>{row.status}</Badge>
          {row.errorMessage ? <span className="max-w-[16rem] truncate text-xs text-red-600 dark:text-red-400">{row.errorMessage}</span> : null}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Uploaded', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <Button
          variant="danger"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            setPendingDelete(row);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const confirmDelete = async () => {
    const result = await deleteDocument(pendingDelete.id);
    if (result.error) toast.error(result.error.message);
    else toast.success(`${pendingDelete.filename} deleted.`);
    setPendingDelete(null);
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Workspace</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Signed in as {user?.email}. Uploaded documents are parsed and stored against your account. Open one to summarise it or ask questions.</p>
        </div>
        <Link
          to={PATHS.profile}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-line bg-white dark:bg-slate-900 dark:border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-surface-muted hover:text-ink sm:self-center"
        >
          <User className="size-3.5 text-slate-500 dark:text-slate-400" />
          <span>Account Settings</span>
        </Link>
      </div>

      <Card>
        <CardHeader title="Upload a document" description="PDF, DOCX or TXT. Text is extracted on upload." />
        <CardBody>
          <UploadDropzone
            onFiles={onFiles}
            accept={ACCEPTED_TYPES}
            maxSize={MAX_UPLOAD_BYTES}
            disabled={isUploading}
            label={isUploading ? 'Uploading…' : 'Choose files'}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Your documents" description={meta ? `${meta.total} document(s) stored` : 'Loading…'} />
        <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search documents by name…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line bg-white dark:bg-slate-900 dark:border-slate-750 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
            />
          </div>
        </div>
        <Table
          columns={columns}
          data={documents}
          isLoading={isFetching}
          onRowClick={(row) => row.status === 'READY' && navigate(documentPath(row.id))}
          emptyIcon={<Inbox className="size-6" />}
          emptyTitle="No documents yet"
          emptyDescription="Upload a PDF, Word or text file to get started."
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

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete this document?"
        message={`${pendingDelete?.filename ?? ''} and its extracted text will be removed permanently.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default DashboardPage;
