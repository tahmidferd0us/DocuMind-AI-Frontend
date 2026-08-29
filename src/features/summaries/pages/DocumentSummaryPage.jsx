import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, NumberInput, Select, Spinner } from '@components/ui';
import { formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
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

const DocumentSummaryPage = () => {
  const { document } = useOutletContext();
  const toast = useToast();
  const [options, setOptions] = useState({ sentences: 5, method: 'lexrank', format: 'paragraph', length: 'standard' });

  const { data: summary, isFetching } = useGetSummaryQuery(document.id);
  const [generateSummary, { isLoading: isGenerating }] = useGenerateSummaryMutation();

  const setOption = (key) => (value) => setOptions((current) => ({ ...current, [key]: value }));

  const handleGenerate = async () => {
    const result = await generateSummary({ documentId: document.id, ...options });
    if (result.error) return toast.error(result.error.message);
    if (result.data.abstractiveFailed) return toast.warning('Extractive summary created, but the language model call failed.');
    return toast.success('Summary generated.');
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <Card>
        <CardHeader title="Options" description="How the summary should be built." />
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberInput label="Extractive sentences" value={options.sentences} onChange={setOption('sentences')} min={1} max={20} />
          <Select label="Ranking method" value={options.method} onChange={(event) => setOption('method')(event.target.value)} placeholder="" options={METHODS} />
          <Select label="Abstractive format" value={options.format} onChange={(event) => setOption('format')(event.target.value)} placeholder="" options={FORMATS} />
          <Select label="Abstractive length" value={options.length} onChange={(event) => setOption('length')(event.target.value)} placeholder="" options={LENGTHS} />
        </CardBody>
        <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-xs text-slate-500">{summary ? `Last generated ${formatDate(summary.updatedAt)}` : 'No summary yet.'}</p>
          <Button onClick={handleGenerate} isLoading={isGenerating} leftIcon={<Sparkles className="size-4" />} fullWidth className="sm:w-auto">
            {summary ? 'Regenerate' : 'Generate summary'}
          </Button>
        </div>
      </Card>

      {summary?.abstractiveFailed ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-900">
            The extractive summary succeeded, but the language model call failed. Check <code>GEMINI_API_KEY</code> and <code>GEMINI_MODEL</code> in the
            NLP service.
          </p>
        </div>
      ) : null}

      {isFetching && !summary ? (
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
    </div>
  );
};

export default DocumentSummaryPage;
