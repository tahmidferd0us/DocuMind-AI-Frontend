import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Inbox, ScrollText } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, NumberInput, Select, Spinner } from '@components/ui';
import { formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
import { useListDocumentsQuery } from '@features/documents/documentsApi';
import { PATHS } from '@routes/paths';
import { useGenerateSummaryMutation, useGetSummaryQuery } from '../summariesApi';

const METHODS = [
  { value: 'lexrank', label: 'LexRank' },
  { value: 'lsa', label: 'LSA' },
  { value: 'luhn', label: 'Luhn' },
];

const FORMATS = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'bullets', label: 'Bullet points' },
];

const LENGTHS = [
  { value: 'short', label: 'Short' },
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Detailed' },
];

const SummaryPanel = ({ title, caption, body, isEmpty }) => (
  <Card className="flex flex-col">
    <CardHeader title={title} description={caption} />
    <CardBody className="flex-1">
      {isEmpty ? (
        <p className="text-sm text-slate-400">Nothing generated yet.</p>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{body}</p>
      )}
    </CardBody>
  </Card>
);

const SummarizePage = () => {
  const toast = useToast();
  const { data: documentPage, isFetching: isLoadingDocuments } = useListDocumentsQuery({ page: 1, limit: 100 });
  const [documentId, setDocumentId] = useState('');
  const [options, setOptions] = useState({ sentences: 5, method: 'lexrank', format: 'paragraph', length: 'standard' });

  const readyDocuments = (documentPage?.items ?? []).filter((item) => item.status === 'READY');

  useEffect(() => {
    if (!documentId && readyDocuments.length) setDocumentId(readyDocuments[0].id);
  }, [documentId, readyDocuments]);

  const { data: summary, isFetching: isLoadingSummary } = useGetSummaryQuery(documentId, { skip: !documentId });
  const [generateSummary, { isLoading: isGenerating }] = useGenerateSummaryMutation();

  const handleGenerate = async () => {
    const result = await generateSummary({ documentId, ...options });
    if (result.error) return toast.error(result.error.message);
    if (result.data.abstractiveFailed) return toast.warning('Extractive summary created, but the language model call failed.');
    return toast.success('Summary generated.');
  };

  const setOption = (key) => (value) => setOptions((current) => ({ ...current, [key]: value }));

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-12">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          <ScrollText className="size-3.5" />
          Summarize
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Summarize a document</h1>
        <p className="mt-1 text-sm text-slate-500">
          Extractive uses the document&apos;s own sentences. Abstractive is written fresh. Compare them to spot drift.
        </p>
      </div>

      {isLoadingDocuments && !readyDocuments.length ? (
        <Card>
          <CardBody className="flex justify-center py-12">
            <Spinner size="lg" className="text-brand-600" />
          </CardBody>
        </Card>
      ) : readyDocuments.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Inbox className="size-6" />}
            title="No documents ready yet"
            description="Upload a PDF, Word or text file first — its text has to be extracted before it can be summarised."
            action={
              <Link
                to={PATHS.dashboard}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Go to workspace
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader title="Options" description="Pick a document and how the summary should be built." />
            <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                label="Document"
                value={documentId}
                onChange={(event) => setDocumentId(event.target.value)}
                placeholder=""
                options={readyDocuments.map((item) => ({ value: item.id, label: item.filename }))}
                containerClassName="sm:col-span-2 lg:col-span-4"
              />
              <NumberInput label="Extractive sentences" value={options.sentences} onChange={setOption('sentences')} min={1} max={20} />
              <Select label="Ranking method" value={options.method} onChange={(event) => setOption('method')(event.target.value)} placeholder="" options={METHODS} />
              <Select label="Abstractive format" value={options.format} onChange={(event) => setOption('format')(event.target.value)} placeholder="" options={FORMATS} />
              <Select label="Abstractive length" value={options.length} onChange={(event) => setOption('length')(event.target.value)} placeholder="" options={LENGTHS} />
            </CardBody>
            <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-xs text-slate-500">
                {summary ? `Last generated ${formatDate(summary.updatedAt)}` : 'No summary for this document yet.'}
              </p>
              <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!documentId} leftIcon={<FileText className="size-4" />} fullWidth className="sm:w-auto">
                {summary ? 'Regenerate' : 'Generate summary'}
              </Button>
            </div>
          </Card>

          {summary?.abstractiveFailed ? (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                The extractive summary succeeded, but the language model call failed. Check <code>GEMINI_API_KEY</code> and{' '}
                <code>GEMINI_MODEL</code> in the NLP service.
              </p>
            </div>
          ) : null}

          {isLoadingSummary && !summary ? (
            <Card>
              <CardBody className="flex justify-center py-12">
                <Spinner size="lg" className="text-brand-600" />
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <SummaryPanel
                title="Extractive"
                caption={summary ? `${summary.sentenceCount} sentences · ${summary.method}` : 'Ranked from the document'}
                body={summary?.extractive}
                isEmpty={!summary}
              />
              <SummaryPanel
                title="Abstractive"
                caption={summary ? `${summary.format} · ${summary.model}` : 'Written by the language model'}
                body={summary?.abstractive}
                isEmpty={!summary || summary.abstractiveFailed}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SummarizePage;
