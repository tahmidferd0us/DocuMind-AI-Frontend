import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertTriangle, Award, Check, ChevronDown, Copy, Gauge, Scale, Sparkles } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, NumberInput, Select, Spinner, Textarea } from '@components/ui';
import { formatDate } from '@lib/format';
import { selectUserPreferences } from '@features/profile/profileSlice';
import { useToast } from '@features/toast/useToast';
import { useEvaluateSummaryMutation, useGenerateSummaryMutation, useGetSummaryQuery } from '../summariesApi';

const METHODS = [
  { value: 'lexrank', label: 'LexRank (Default)' },
  { value: 'lsa', label: 'LSA (Latent Semantic Analysis)' },
  { value: 'luhn', label: 'Luhn (Frequency-based)' },
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

const SummaryPanel = ({ title, caption, body, isEmpty, onCopy }) => (
  <Card className="flex flex-col">
    <div className="flex items-center justify-between border-b border-line px-5 py-4">
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="text-xs text-slate-500">{caption}</p>
      </div>
      {!isEmpty && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(body, title)}
          leftIcon={<Copy className="size-3.5" />}
          className="text-xs"
        >
          Copy
        </Button>
      )}
    </div>
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
  const preferences = useSelector(selectUserPreferences);

  const [options, setOptions] = useState({
    sentences: Number(preferences?.defaultSentenceCount) || 5,
    method: 'lexrank',
    format: 'paragraph',
    length: 'standard',
  });

  const { data: summary, isFetching } = useGetSummaryQuery(document.id);
  const [generateSummary, { isLoading: isGenerating }] = useGenerateSummaryMutation();

  // Evaluation states
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [referenceText, setReferenceText] = useState('');
  const [candidateType, setCandidateType] = useState('abstractive');
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [evaluateSummary, { isLoading: isEvaluating }] = useEvaluateSummaryMutation();

  const setOption = (key) => (value) => setOptions((current) => ({ ...current, [key]: value }));

  const handleGenerate = async () => {
    const result = await generateSummary({ documentId: document.id, ...options });
    if (result.error) return toast.error(result.error.message);
    if (result.data.abstractiveFailed) return toast.warning('Extractive summary created, but the language model call failed.');
    return toast.success('Summary generated.');
  };

  const handleCopy = (text, title) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${title} summary copied to clipboard.`);
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!referenceText.trim()) return toast.warning('Please enter reference or gold standard summary text.');
    const result = await evaluateSummary({
      documentId: document.id,
      reference: referenceText.trim(),
      candidateType,
    });
    if (result.error) {
      return toast.error(result.error.message || 'Evaluation failed.');
    }
    setEvaluationResults(result.data);
    toast.success('ROUGE & BLEU metrics calculated successfully.');
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
            onCopy={handleCopy}
          />
          <SummaryPanel
            title="Abstractive"
            caption={summary ? `${summary.format} · ${summary.model}` : 'Written by the language model'}
            body={summary?.abstractive}
            isEmpty={!summary || summary.abstractiveFailed}
            onCopy={handleCopy}
          />
        </div>
      )}

      {/* Summary Quality Evaluation Section */}
      {summary && (
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                <Scale className="size-4 text-brand-600" />
                Summary Evaluation Suite (ROUGE &amp; BLEU)
              </h3>
              <p className="text-xs text-slate-500">Benchmark generated summaries against a reference ground-truth text.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEvaluation((prev) => !prev)}
            >
              {showEvaluation ? 'Hide Evaluation' : 'Evaluate Quality'}
            </Button>
          </div>

          {showEvaluation && (
            <CardBody className="flex flex-col gap-5 pt-5">
              <form onSubmit={handleEvaluate} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Candidate Summary to Evaluate"
                    value={candidateType}
                    onChange={(e) => setCandidateType(e.target.value)}
                    options={[
                      { value: 'abstractive', label: 'Abstractive Summary (AI synthesis)' },
                      { value: 'extractive', label: 'Extractive Summary (LexRank sentences)' },
                    ]}
                  />
                  <div className="flex items-end">
                    <p className="text-xs text-slate-500 pb-2">
                      Comparing against standard research metrics (ROUGE-1, ROUGE-2, ROUGE-L, and BLEU-4).
                    </p>
                  </div>
                </div>

                <Textarea
                  label="Reference Ground-Truth Summary"
                  placeholder="Paste expert or human-written summary here to measure factual overlap and linguistic precision..."
                  rows={4}
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                  required
                />

                <div className="flex justify-end">
                  <Button type="submit" isLoading={isEvaluating} leftIcon={<Gauge className="size-4" />}>
                    Calculate Metrics
                  </Button>
                </div>
              </form>

              {evaluationResults && (
                <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Evaluation Results
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>ROUGE-1</span>
                        <Badge tone="brand">Unigrams</Badge>
                      </div>
                      <div className="mt-2 text-2xl font-bold text-ink">
                        {evaluationResults.rouge1?.fmeasure ?? 0}%
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        P: {evaluationResults.rouge1?.precision}% · R: {evaluationResults.rouge1?.recall}%
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>ROUGE-2</span>
                        <Badge tone="brand">Bigrams</Badge>
                      </div>
                      <div className="mt-2 text-2xl font-bold text-ink">
                        {evaluationResults.rouge2?.fmeasure ?? 0}%
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        P: {evaluationResults.rouge2?.precision}% · R: {evaluationResults.rouge2?.recall}%
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>ROUGE-L</span>
                        <Badge tone="brand">LCS</Badge>
                      </div>
                      <div className="mt-2 text-2xl font-bold text-ink">
                        {evaluationResults.rougeL?.fmeasure ?? 0}%
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Longest Common Subsequence
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>BLEU</span>
                        <Badge tone="neutral">Precision</Badge>
                      </div>
                      <div className="mt-2 text-2xl font-bold text-ink">
                        {evaluationResults.bleu?.score ?? 0}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Bilingual Evaluation Understudy
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          )}
        </Card>
      )}
    </div>
  );
};

export default DocumentSummaryPage;
