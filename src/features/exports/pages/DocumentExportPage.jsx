import { useOutletContext } from 'react-router-dom';
import { Check, Download, Minus } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Spinner, useFileDownload } from '@components/ui';
import { API_BASE_URL } from '@lib/constants';
import { useToast } from '@features/toast/useToast';
import { useGetReportContentsQuery } from '../exportsApi';

const Row = ({ included, label, detail }) => (
  <li className="flex items-start gap-3">
    <span
      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${included ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
    >
      {included ? <Check className="size-3" /> : <Minus className="size-3" />}
    </span>
    <span className="min-w-0">
      <span className={`text-sm ${included ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
      {detail ? <span className="ml-1.5 text-xs text-slate-500">{detail}</span> : null}
    </span>
  </li>
);

const DocumentExportPage = () => {
  const { document } = useOutletContext();
  const toast = useToast();
  const { data: contents, isFetching } = useGetReportContentsQuery(document.id);
  const { download, isDownloading } = useFileDownload();

  const base = document.filename.replace(/\.[^.]+$/, '');

  const handleDownload = async (format) => {
    const ok = await download(`/exports/${document.id}/${format}`, { filename: `DocuMind_${base}.${format}` });
    if (!ok) toast.error(`Could not generate the ${format.toUpperCase()} report.`);
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <Card>
        <CardHeader title="Report contents" description="Whatever you have generated so far is included. Anything missing is simply left out." />
        <CardBody>
          {isFetching && !contents ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" className="text-brand-600" />
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              <Row included label="Document metadata and reading analytics" detail={`${document.wordCount?.toLocaleString() ?? 0} words`} />
              <Row included={contents?.hasSummary} label="Extractive and abstractive summaries" detail={contents?.hasSummary ? null : 'generate one on the Summary tab'} />
              <Row
                included={contents?.hasEntities}
                label="Named entities and key phrases"
                detail={contents?.hasEntities ? `${contents.entityCount} entities · ${contents.keywordCount} phrases` : 'extract them on the Entities tab'}
              />
              <Row
                included={Boolean(contents?.questionCount)}
                label="Question and answer history"
                detail={contents?.questionCount ? `${contents.questionCount} exchange(s)` : 'ask something on the Ask tab'}
              />
            </ul>
          )}
        </CardBody>
        <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:justify-end sm:p-6">
          <Button variant="outline" onClick={() => handleDownload('docx')} isLoading={isDownloading} leftIcon={<Download className="size-4" />}>
            Download DOCX
          </Button>
          <Button onClick={() => handleDownload('pdf')} isLoading={isDownloading} leftIcon={<Download className="size-4" />}>
            Download PDF
          </Button>
        </div>
      </Card>

      <p className="text-xs text-slate-400">
        Reports are generated on demand from <code>{API_BASE_URL}/exports/{document.id}</code> and are not stored on the server.
      </p>
    </div>
  );
};

export default DocumentExportPage;
