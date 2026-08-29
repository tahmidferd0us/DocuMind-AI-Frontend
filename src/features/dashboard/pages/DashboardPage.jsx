import { useState } from 'react';
import { FileText, Inbox } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, ConfirmModal, Table, UploadDropzone } from '@components/ui';
import { formatBytes, formatDate } from '@lib/format';
import { DEFAULT_PAGE_SIZE } from '@lib/constants';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from '@lib/tools';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { useDocumentIntake } from '@features/upload/useDocumentIntake';
import { useDeleteDocumentMutation, useListDocumentsQuery } from '@features/documents/documentsApi';

const STATUS_TONES = { READY: 'success', PROCESSING: 'warning', FAILED: 'danger' };

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { onFiles, isUploading } = useDocumentIntake();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data, isFetching } = useListDocumentsQuery({ page, limit: pageSize });
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const documents = data?.items ?? [];
  const meta = data?.meta;

  const columns = [
    {
      key: 'filename',
      header: 'Document',
      render: (row) => (
        <span className="flex items-center gap-2 font-medium text-slate-800">
          <FileText className="size-4 shrink-0 text-brand-600" />
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
          {row.errorMessage ? <span className="max-w-[16rem] truncate text-xs text-red-600">{row.errorMessage}</span> : null}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Uploaded', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <Button variant="danger" size="sm" onClick={() => setPendingDelete(row)}>
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Signed in as {user?.email}. Uploaded documents are parsed and stored against your account.</p>
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
        <Table
          columns={columns}
          data={documents}
          isLoading={isFetching}
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
