import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, FileText, RotateCw } from 'lucide-react';
import { Badge, Button, Card, CardBody, EmptyState, Spinner } from '@components/ui';
import { cn } from '@lib/cn';
import { formatBytes, formatDate } from '@lib/format';
import { DOCUMENT_STAGES, PATHS, documentPath } from '@routes/paths';
import { useToast } from '@features/toast/useToast';
import { useGetDocumentQuery, useRetryDocumentMutation } from '../documentsApi';

const STATUS_TONES = { READY: 'success', PROCESSING: 'warning', FAILED: 'danger' };

const DocumentWorkspace = () => {
  const { documentId } = useParams();
  const { data: document, isLoading, isError, refetch } = useGetDocumentQuery(documentId);
  const [retryDocument, { isLoading: isRetrying }] = useRetryDocumentMutation();
  const toast = useToast();

  const handleRetry = async () => {
    try {
      await retryDocument(document.id).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Could not retry document processing');
    }
  };

  useEffect(() => {
    if (document?.status !== 'PROCESSING') return undefined;
    const timer = setInterval(() => refetch(), 2000);
    return () => clearInterval(timer);
  }, [document?.status, refetch]);

  if (isLoading) {
    return (
      <div className="container-page py-16">
        <div className="flex justify-center">
          <Spinner size="lg" className="text-brand-600" />
        </div>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="container-page py-12">
        <Card>
          <EmptyState
            icon={<FileText className="size-6" />}
            title="Document not found"
            description="It may have been deleted, or it belongs to another account."
            action={
              <NavLink
                to={PATHS.dashboard}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Back to workspace
              </NavLink>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-line bg-white dark:bg-slate-900">
        <div className="container-page pt-6 sm:pt-8">
          <NavLink to={PATHS.dashboard} className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-brand-700 dark:hover:text-brand-300">
            <ArrowLeft className="size-4" />
            All documents
          </NavLink>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-ink sm:text-2xl">{document.filename}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {[
                  document.pageCount ? `${document.pageCount} page${document.pageCount > 1 ? 's' : ''}` : null,
                  document.wordCount ? `${document.wordCount.toLocaleString()} words` : null,
                  formatBytes(document.sizeBytes),
                  `uploaded ${formatDate(document.createdAt)}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <Badge tone={STATUS_TONES[document.status]}>{document.status}</Badge>
          </div>

          <nav className="-mb-px mt-5 flex gap-1 overflow-x-auto">
            {DOCUMENT_STAGES.map((stage) => (
              <NavLink
                key={stage.key}
                to={documentPath(documentId, stage.segment)}
                end={stage.segment === ''}
                aria-disabled={!stage.ready || undefined}
                onClick={(event) => !stage.ready && event.preventDefault()}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                    !stage.ready
                      ? 'cursor-not-allowed border-transparent text-slate-300 dark:text-slate-600'
                      : isActive
                        ? 'border-brand-600 text-brand-700 dark:text-brand-300 dark:border-brand-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-line hover:text-ink dark:hover:text-white',
                  )
                }
              >
                {stage.label}
                {stage.ready ? null : <span className="ml-1.5 text-[10px] uppercase tracking-wide">soon</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {document.status === 'READY' ? (
        <Outlet context={{ document }} />
      ) : (
        <div className="container-page py-12">
          <Card>
            <CardBody className="flex flex-col items-center gap-4 py-10 text-center">
              {document.status === 'PROCESSING' ? (
                <>
                  <div className="w-full max-w-md">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">{document.processingStep || 'Processing document'}</span>
                      <span className="text-slate-500 dark:text-slate-400">{document.progress ?? 0}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-label="Document processing progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={document.progress ?? 0}>
                      <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${document.progress ?? 0}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Attempt {Math.max(document.attemptCount ?? 0, 1)} of 3. This page updates automatically.</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{document.errorMessage || 'Processing failed. You can retry this document.'}</p>
                  <Button disabled={isRetrying} onClick={handleRetry}>
                    <RotateCw className="size-4" />
                    {isRetrying ? 'Retrying…' : 'Retry processing'}
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentWorkspace;
