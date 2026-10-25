import { useOutletContext } from 'react-router-dom';
import { Award, BarChart3, BookOpen, Clock, FileText, Gauge, Hash, Sparkles, Volume2 } from 'lucide-react';
import { Badge, Card, CardBody, CardHeader, Spinner } from '@components/ui';
import { useGetDocumentAnalyticsQuery } from '../analyticsApi';

const getScoreTone = (score) => {
  if (score >= 70) return 'success';
  if (score >= 50) return 'brand';
  if (score >= 30) return 'warning';
  return 'danger';
};

const DocumentAnalyticsPage = () => {
  const { document } = useOutletContext();
  const { data: analytics, isLoading, isError, error } = useGetDocumentAnalyticsQuery(document.id);

  if (isLoading) {
    return (
      <div className="container-page py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner size="lg" className="text-brand-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Computing linguistic analytics and readability metrics…</p>
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="container-page py-8">
        <Card>
          <CardBody>
            <p className="text-sm text-red-600">
              Could not load document analytics: {error?.message || 'NLP service unavailable'}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const {
    word_count = document.wordCount || 0,
    char_count = document.charCount || 0,
    sentence_count = 0,
    paragraph_count = 0,
    reading_time_min = 0,
    speaking_time_min = 0,
    vocabulary_richness_pct = 0,
    unique_words = 0,
    avg_words_per_sentence = 0,
    avg_chars_per_word = 0,
    readability = {},
  } = analytics;

  const readabilityScore = readability.score ?? 0;
  const readabilityGrade = readability.grade ?? 'Standard';
  const readabilityLevel = readability.level ?? 'General';
  const scoreTone = getScoreTone(readabilityScore);

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      {/* Top Banner / Readability Score Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Readability & Complexity"
            description="Linguistic assessment computed via the Flesch Reading Ease index."
          />
          <CardBody className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-surface-muted p-5">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-sm">
                  <Gauge className="size-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold tracking-tight text-ink">{readabilityScore}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">/ 100</span>
                    <Badge tone={scoreTone} className="ml-2 font-semibold">
                      {readabilityLevel}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Target education level: <span className="font-medium text-slate-700 dark:text-slate-200">{readabilityGrade}</span></p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-white dark:bg-slate-900 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="size-4 text-brand-600 dark:text-brand-400" />
                  Vocabulary Richness
                </div>
                <div className="mt-2 text-2xl font-bold text-ink">{vocabulary_richness_pct}%</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{unique_words.toLocaleString()} unique word roots</p>
              </div>

              <div className="rounded-xl border border-line bg-white dark:bg-slate-900 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Avg Words / Sentence
                </div>
                <div className="mt-2 text-2xl font-bold text-ink">{avg_words_per_sentence}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Across {sentence_count.toLocaleString()} sentences</p>
              </div>

              <div className="rounded-xl border border-line bg-white dark:bg-slate-900 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <Hash className="size-4 text-amber-600 dark:text-amber-400" />
                  Avg Chars / Word
                </div>
                <div className="mt-2 text-2xl font-bold text-ink">{avg_chars_per_word}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Syllabic complexity indicator</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Time Estimates Card */}
        <Card className="flex flex-col">
          <CardHeader
            title="Pacing Estimates"
            description="Estimated delivery & consumption duration."
          />
          <CardBody className="flex flex-1 flex-col justify-around gap-4">
            <div className="flex items-center gap-4 rounded-xl border border-line p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <BookOpen className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Silent Reading Time</p>
                <p className="mt-0.5 text-2xl font-bold text-ink">{reading_time_min} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">min</span></p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400">At standard reading rate of 220 WPM</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-line p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Volume2 className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Speaking / Presentation</p>
                <p className="mt-0.5 text-2xl font-bold text-ink">{speaking_time_min} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">min</span></p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400">At presentation pace of 140 WPM</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Structural Metrics Grid */}
      <Card>
        <CardHeader
          title="Structural Composition"
          description="Detailed count and distribution of linguistic units."
        />
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Words</p>
            <p className="mt-1 text-2xl font-bold text-ink">{word_count.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Normalized lexical tokens</p>
          </div>

          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Characters</p>
            <p className="mt-1 text-2xl font-bold text-ink">{char_count.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Including whitespace</p>
          </div>

          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sentences</p>
            <p className="mt-1 text-2xl font-bold text-ink">{sentence_count.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Parsed sentence boundaries</p>
          </div>

          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Paragraphs</p>
            <p className="mt-1 text-2xl font-bold text-ink">{paragraph_count.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Distinct structural blocks</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentAnalyticsPage;
