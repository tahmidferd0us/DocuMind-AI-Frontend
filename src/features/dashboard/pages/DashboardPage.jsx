import { useMemo, useState } from 'react';
import { FileText, Inbox } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, ConfirmModal, FileUploader, Input, NumberInput, Select, Table } from '@components/ui';
import { formatDate } from '@lib/format';
import { DEFAULT_PAGE_SIZE } from '@lib/constants';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';

const STATUS_TONES = { Ready: 'success', Processing: 'warning', Failed: 'danger' };

const SAMPLE_ROWS = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  name: `sample-document-${index + 1}.pdf`,
  pages: ((index * 7) % 40) + 3,
  status: ['Ready', 'Processing', 'Failed'][index % 3],
  uploadedAt: new Date(Date.now() - index * 36e5).toISOString(),
}));

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [files, setFiles] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [chunkSize, setChunkSize] = useState(800);
  const [summaryMode, setSummaryMode] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => SAMPLE_ROWS.filter((row) => row.name.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  const paged = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);

  const columns = [
    { key: 'name', header: 'Document', render: (row) => (
      <span className="flex items-center gap-2 font-medium text-slate-800">
        <FileText className="size-4 shrink-0 text-brand-600" />
        <span className="truncate">{row.name}</span>
      </span>
    ) },
    { key: 'pages', header: 'Pages', align: 'right' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={STATUS_TONES[row.status]}>{row.status}</Badge> },
    { key: 'uploadedAt', header: 'Uploaded', render: (row) => formatDate(row.uploadedAt) },
    { key: 'actions', header: '', align: 'right', render: (row) => (
      <Button variant="danger" size="sm" onClick={() => setPendingDelete(row)}>
        Delete
      </Button>
    ) },
  ];

  const handleUploadChange = (nextFiles) => {
    setFiles(nextFiles);
    if (nextFiles.length) toast.success(`${nextFiles[nextFiles.length - 1].name} is ready to process.`);
  };

  const confirmDelete = () => {
    toast.info(`${pendingDelete.name} would be deleted once the documents module is wired up.`);
    setPendingDelete(null);
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Signed in as {user?.email}. The documents module is not built yet — this page exercises the shared components.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Upload a document" description="PDF, DOCX or TXT. Wire this to the documents module when it exists." />
          <CardBody>
            <FileUploader value={files} onChange={handleUploadChange} multiple />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Processing options" />
          <CardBody className="flex flex-col gap-4">
            <Select
              label="Summary mode"
              value={summaryMode}
              onChange={(event) => setSummaryMode(event.target.value)}
              options={[
                { value: 'extractive', label: 'Extractive' },
                { value: 'abstractive', label: 'Abstractive' },
                { value: 'both', label: 'Both' },
              ]}
            />
            <NumberInput label="Chunk size" value={chunkSize} onChange={setChunkSize} min={200} max={2000} step={100} hint="Characters per retrieval chunk" />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Documents"
          description="Sample rows demonstrating the paginated table."
          action={<Input placeholder="Search documents" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} containerClassName="w-full sm:w-64" />}
        />
        <Table
          columns={columns}
          data={paged}
          emptyIcon={<Inbox className="size-6" />}
          emptyTitle="No documents match that search"
          emptyDescription="Try a different filename."
          containerClassName="rounded-none border-0"
          pagination={{ page, pageSize, total: filtered.length, onPageChange: setPage, onPageSizeChange: (size) => { setPageSize(size); setPage(1); } }}
        />
      </Card>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this document?"
        message={`${pendingDelete?.name ?? ''} and everything derived from it would be removed.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default DashboardPage;
