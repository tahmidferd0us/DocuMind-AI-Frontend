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
import { useBulkDocumentsMutation, useDeleteDocumentMutation, useListDocumentsQuery, useUpdateDocumentMutation } from '@features/documents/documentsApi';
import { useGetServiceStatusQuery } from '@lib/api';

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
  const [sort, setSort] = useState('newest');
  const [tag, setTag] = useState('');
  const [folder, setFolder] = useState('');
  const [selected, setSelected] = useState([]);
  const [bulkValue, setBulkValue] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data, isFetching } = useListDocumentsQuery({
    page,
    limit: pageSize,
    search: search.trim(),
    status, sort, tag: tag.trim(), folder: folder.trim(),
  });
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();
  const [bulkDocuments, { isLoading: isBulkLoading }] = useBulkDocumentsMutation();
  const { data: serviceStatus, isError: statusError } = useGetServiceStatusQuery(undefined, { pollingInterval: 60000 });

  const documents = data?.items ?? [];
  const meta = data?.meta;

  const columns = [
    {
      key: 'filename',
      header: 'Document',
      render: (row) => (
        <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
          <FileText className="size-4 shrink-0 text-brand-600 dark:text-brand-400" />
          <span className="min-w-0 truncate">{row.displayName || row.filename}<span className="block truncate text-xs font-normal text-slate-500 dark:text-slate-400">{[row.folder, ...(row.tags || [])].filter(Boolean).join(' · ')}</span></span>
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
    { key: 'select', header: 'Select', render: (row) => <input type="checkbox" aria-label={`Select ${row.displayName || row.filename}`} checked={selected.includes(row.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id))} onClick={(event) => event.stopPropagation()} className="size-5 accent-brand-600" /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
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
        <Button variant="ghost" size="sm" aria-label={`Rename ${row.displayName || row.filename}`} onClick={(event) => { event.stopPropagation(); renameDocument(row); }}>Rename</Button>
        </div>
      ),
    },
  ];

  const confirmDelete = async () => {
    const result = await deleteDocument(pendingDelete.id);
    if (result.error) toast.error(result.error.message);
    else toast.success(`${pendingDelete.filename} deleted.`);
    setPendingDelete(null);
  };

  const renameDocument = async (row) => {
    const name = window.prompt('Document name', row.displayName || row.filename);
    if (!name?.trim()) return;
    const result = await updateDocument({ id: row.id, displayName: name.trim() });
    if (result.error) toast.error(result.error.message); else toast.success('Document renamed.');
  };
  const applyBulk = async (action) => {
    if (action === 'delete' && !window.confirm(`Permanently delete ${selected.length} selected document(s), their originals, extracted text, search indexes and analysis results?`)) return;
    try { const result = await bulkDocuments({ ids: selected, action, ...(action === 'move' ? { folder: bulkValue } : action === 'tag' ? { tag: bulkValue } : {}) }).unwrap(); toast.success(`${result.affected} document(s) updated.`); setSelected([]); setBulkValue(''); }
    catch (error) { toast.error(error?.data?.message || 'The bulk action could not be completed.'); }
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Workspace</h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">Signed in as {user?.email}. Upload a text based PDF, DOCX or TXT. DocuMind extracts pages, creates optional summaries and entity results, then retrieves cited passages for Q&amp;A. Scanned PDFs without a text layer are not OCR processed; English is the primary supported language. Your account’s upload and monthly usage limits are in Billing. Deleting a document removes its original, extracted text, search index and derived results.</p>
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

      {(statusError || serviceStatus?.status !== 'ready') && <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">Some DocuMind services are unavailable. Existing documents remain saved; processing and analysis will resume when the database and NLP service recover. Refresh this page in a minute to check again.</div>}

      <Card>
        <CardHeader title="Your documents" description={meta ? `${meta.total} document(s) stored` : 'Loading…'} />
        <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search documents by name…"
              aria-label="Search documents by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line bg-white dark:bg-slate-900 dark:border-slate-700 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
            />
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm text-slate-600 dark:text-slate-300">Sort <select aria-label="Sort documents" value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-2 dark:border-slate-700 dark:bg-slate-900"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Name</option><option value="size">Largest</option></select></label>
          <input aria-label="Filter by tag" value={tag} onChange={(e) => { setTag(e.target.value); setPage(1); }} placeholder="Filter tag" className="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 sm:w-32" />
          <input aria-label="Filter by folder" value={folder} onChange={(e) => { setFolder(e.target.value); setPage(1); }} placeholder="Filter folder" className="min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 sm:w-32" />
        </div>
        <div className="flex flex-col gap-2 border-t border-line p-4 sm:flex-row sm:items-center"><span className="text-sm text-slate-600 dark:text-slate-300">{selected.length} selected</span><input aria-label="Folder or tag value for bulk action" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} placeholder="Folder name or tag" className="min-h-11 flex-1 rounded-lg border border-line bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900" /><Button variant="outline" disabled={!selected.length || !bulkValue.trim() || isBulkLoading} onClick={() => applyBulk('move')}>Move to folder</Button><Button variant="outline" disabled={!selected.length || !bulkValue.trim() || isBulkLoading} onClick={() => applyBulk('tag')}>Add tag</Button><Button variant="danger" disabled={!selected.length || isBulkLoading} onClick={() => applyBulk('delete')}>Delete selected</Button><Button variant="ghost" disabled={!selected.length} onClick={() => setSelected([])}>Clear</Button><Button variant="ghost" size="sm" onClick={() => documents.length && setSelected(selected.length === documents.length ? [] : documents.map((item) => item.id))}>Select page</Button></div>
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
        message={`${pendingDelete?.filename ?? ''}, its stored original, extracted text, search index, summaries, entities, questions and citations will be removed. Usage counters will be adjusted.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default DashboardPage;
