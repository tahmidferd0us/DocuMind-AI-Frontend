import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock, FileText } from 'lucide-react';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES, TOOLS, getTool } from '@lib/tools';
import { ILLUSTRATIONS } from '@components/illustrations/ToolIllustrations';
import { UploadDropzone } from '@components/ui';
import { useAuth } from '@features/auth/useAuth';
import { useListDocumentsQuery } from '@features/documents/documentsApi';
import { useDocumentIntake } from '@features/upload/useDocumentIntake';
import { DOCUMENT_STAGES, PATHS, documentPath } from '@routes/paths';

const stageFor = (toolKey) => (DOCUMENT_STAGES.find((stage) => stage.key === toolKey && stage.ready)?.segment ?? '');

const ToolPage = ({ toolKey }) => {
  const tool = getTool(toolKey);
  const { onFiles, isUploading } = useDocumentIntake();
  const { isAuthenticated } = useAuth();
  const { data: documentPage } = useListDocumentsQuery({ page: 1, limit: 5 }, { skip: !isAuthenticated });
  const recent = (documentPage?.items ?? []).filter((item) => item.status === 'READY').slice(0, 4);
  const Illustration = ILLUSTRATIONS[tool.illustration];
  const related = TOOLS.filter((entry) => entry.key !== tool.key).slice(0, 3);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-8 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/70 dark:border dark:border-brand-800/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
              <tool.icon className="size-3.5" />
              {tool.name}
            </span>
            <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">{tool.headline}</h1>
          </div>

          {tool.ready ? null : (
            <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 p-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                <span className="font-semibold">Not built yet.</span> {tool.name} is planned for this project but the processing module does not
                exist. You can still upload a document now — it will be waiting in your workspace when this ships.
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-4xl"
          >
            <UploadDropzone onFiles={onFiles} accept={ACCEPTED_TYPES} maxSize={MAX_UPLOAD_BYTES} disabled={isUploading} label={isUploading ? 'Uploading…' : 'Choose files'} />
          </motion.div>

          {recent.length ? (
            <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-line bg-white dark:bg-slate-900 dark:border-slate-800 p-4 sm:p-5">
              <p className="text-sm font-medium text-ink">Or continue with a document you already uploaded</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {recent.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={documentPath(item.id, stageFor(tool.key))}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-muted"
                    >
                      <FileText className="size-4 shrink-0 text-brand-600 dark:text-brand-400" />
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-200">{item.filename}</span>
                      <ArrowRight className="size-4 shrink-0 text-brand-600 dark:text-brand-400 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">{tool.blurb}</p>
            <ul className="flex flex-col gap-3">
              {tool.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">How {tool.name.toLowerCase()} works</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {tool.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600 dark:bg-brand-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">{Illustration ? <Illustration className="h-64 w-full max-w-md text-brand-600 dark:text-brand-400" /> : null}</div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-page py-12 sm:py-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Related stages</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Other capabilities built into DocuMind AI.</p>
            </div>
            <Link to={PATHS.home} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700">
              View full pipeline
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="group flex flex-col rounded-xl border border-line bg-white dark:bg-slate-900 dark:border-slate-800 p-5 transition-shadow hover:shadow-md"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 dark:text-brand-300 text-brand-600">
                  <item.icon className="size-4.5" />
                </span>
                <span className="mt-3 text-base font-semibold text-ink">{item.name}</span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export const createToolPage = (toolKey) => () => <ToolPage toolKey={toolKey} />;

export default ToolPage;
