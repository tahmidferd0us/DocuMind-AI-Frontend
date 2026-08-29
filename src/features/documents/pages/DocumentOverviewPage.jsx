import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, MessagesSquare, ScrollText } from 'lucide-react';
import { Card, CardBody, CardHeader, Spinner } from '@components/ui';
import { documentPath } from '@routes/paths';
import { useGetDocumentTextQuery } from '../documentsApi';

const NEXT_STEPS = [
  { segment: 'summary', icon: ScrollText, title: 'Summarize it', copy: 'Extractive and abstractive summaries, side by side.' },
  { segment: 'ask', icon: MessagesSquare, title: 'Ask about it', copy: 'Answers grounded in the document, with page citations.' },
];

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-line bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-xl font-semibold text-ink">{value}</p>
  </div>
);

const DocumentOverviewPage = () => {
  const { document } = useOutletContext();
  const { data, isFetching } = useGetDocumentTextQuery(document.id);

  const readingMinutes = document.wordCount ? Math.max(1, Math.round(document.wordCount / 200)) : null;

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Pages" value={document.pageCount ?? '—'} />
        <Stat label="Words" value={document.wordCount ? document.wordCount.toLocaleString() : '—'} />
        <Stat label="Characters" value={document.charCount ? document.charCount.toLocaleString() : '—'} />
        <Stat label="Reading time" value={readingMinutes ? `${readingMinutes} min` : '—'} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {NEXT_STEPS.map((step) => (
          <Link
            key={step.segment}
            to={documentPath(document.id, step.segment)}
            className="group flex items-start gap-4 rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <step.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                {step.title}
                <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block text-sm text-slate-500">{step.copy}</span>
            </span>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader title="Extracted text" description="What the summariser and retrieval both read from." />
        <CardBody>
          {isFetching && !data ? (
            <div className="flex justify-center py-10">
              <Spinner size="lg" className="text-brand-600" />
            </div>
          ) : (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface-muted p-4 text-xs leading-relaxed text-slate-700">
              {data?.text ?? 'No text available.'}
            </pre>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentOverviewPage;
