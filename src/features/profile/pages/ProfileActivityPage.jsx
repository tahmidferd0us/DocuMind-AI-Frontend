import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, BarChart3, Clock, Database, FileText, Layers } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Spinner } from '@components/ui';
import { formatBytes, formatDate } from '@lib/format';
import { PATHS, documentPath } from '@routes/paths';
import { useListDocumentsQuery } from '@features/documents/documentsApi';

const STATUS_TONES = { READY: 'success', PROCESSING: 'warning', FAILED: 'danger' };

const ProfileActivityPage = () => {
  const { data, isLoading } = useListDocumentsQuery({ page: 1, limit: 100 });
  const documents = data?.items ?? [];
  const totalDocs = data?.meta?.total ?? documents.length;

  const totalWords = documents.reduce((acc, doc) => acc + (doc.wordCount || 0), 0);
  const totalPages = documents.reduce((acc, doc) => acc + (doc.pageCount || 0), 0);
  const totalBytes = documents.reduce((acc, doc) => acc + (doc.sizeBytes || 0), 0);

  const readyCount = documents.filter((doc) => doc.status === 'READY').length;
  const processingCount = documents.filter((doc) => doc.status === 'PROCESSING').length;
  const failedCount = documents.filter((doc) => doc.status === 'FAILED').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Documents
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/50 dark:text-brand-300">
              <FileText className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isLoading ? '…' : totalDocs}
            </span>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Stored in workspace</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pages Parsed
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Layers className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isLoading ? '…' : totalPages.toLocaleString()}
            </span>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Total document pages</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Words Processed
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <BarChart3 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isLoading ? '…' : totalWords.toLocaleString()}
            </span>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">NLP tokenized words</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Storage Used
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Database className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isLoading ? '…' : formatBytes(totalBytes)}
            </span>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Raw and processed files</p>
          </div>
        </Card>
      </div>

      {/* Processing Status Breakdown Card */}
      <Card>
        <CardHeader
          title="Document Processing Status"
          description="Health and distribution of NLP processing jobs across your documents."
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900 dark:text-emerald-200">Ready &amp; Summarised</span>
                <Badge tone="success">{readyCount}</Badge>
              </div>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                Ready for Q&amp;A, summaries, entity extraction and exports.
              </p>
            </div>

            <div className="rounded-lg border border-amber-100 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-900 dark:text-amber-200">Processing</span>
                <Badge tone="warning">{processingCount}</Badge>
              </div>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Currently extracting text or generating NLP representations.
              </p>
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-900 dark:text-red-200">Failed / Incomplete</span>
                <Badge tone="danger">{failedCount}</Badge>
              </div>
              <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                Files that encountered parse or unreadable formatting issues.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent Documents Activity */}
      <Card>
        <CardHeader
          title="Recent Document Activity"
          description="Most recently uploaded and analyzed files in your workspace."
          action={
            <Link
              to={PATHS.dashboard}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              All documents
              <ArrowUpRight className="size-4" />
            </Link>
          }
        />
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner className="text-brand-600" />
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Activity className="size-6" />}
                title="No activity recorded yet"
                description="Upload documents in your workspace to view processing metrics and history here."
                action={
                  <Link
                    to={PATHS.dashboard}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    Go to Workspace
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-line overflow-x-auto">
              {documents.slice(0, 8).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-muted/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/50 dark:text-brand-300">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{doc.filename}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatBytes(doc.sizeBytes)}</span>
                        <span>·</span>
                        <span>{doc.wordCount ? `${doc.wordCount.toLocaleString()} words` : '0 words'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(doc.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone={STATUS_TONES[doc.status]}>{doc.status}</Badge>
                    {doc.status === 'READY' && (
                      <Link
                        to={documentPath(doc.id)}
                        className="rounded-lg border border-line dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-white dark:hover:bg-slate-800 hover:text-brand-700 dark:hover:text-brand-300"
                      >
                        Open
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileActivityPage;
