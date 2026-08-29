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
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              <tool.icon className="size-3.5" />
              {tool.name}
            </span>
            <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">{tool.headline}</h1>
          </div>

          {tool.ready ? null : (
            <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
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
            <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-line bg-white p-4 sm:p-5">
              <p className="text-sm font-medium text-ink">Or continue with a document you already uploaded</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {recent.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={documentPath(item.id, stageFor(tool.key))}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-muted"
                    >
                      <FileText className="size-4 shrink-0 text-brand-600" />
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{item.filename}</span>
                      <ArrowRight className="size-4 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{tool.blurb}</p>
            <ul className="flex flex-col gap-3">
              {tool.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-slate-700">
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
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">{Illustration ? <Illustration /> : null}</div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-12 sm:py-16">
          <h2 className="text-center text-xl font-bold tracking-tight text-ink sm:text-2xl">Other tools</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <Link
                key={entry.key}
                to={entry.path}
                className="group flex flex-col rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <entry.icon className="size-5" />
                </span>
                <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
                  {entry.name}
                  {entry.ready ? null : (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Soon</span>
                  )}
                </span>
                <span className="mt-1 text-sm text-slate-500">{entry.tagline}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                  Open
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to={PATHS.home} className="font-medium text-brand-600 underline-offset-4 hover:underline">
              Back to all tools
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export const createToolPage = (toolKey) => {
  const Page = () => <ToolPage toolKey={toolKey} />;
  Page.displayName = `ToolPage(${toolKey})`;
  return Page;
};

export default ToolPage;
