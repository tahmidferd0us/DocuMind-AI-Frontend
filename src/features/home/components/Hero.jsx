import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, FilePlus2, FileText } from 'lucide-react';
import { cn } from '@lib/cn';
import { formatBytes } from '@lib/format';
import { ACCEPTED_TYPES } from '@lib/tools';
import { validateFiles } from '@components/ui/FileUploader';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { PATHS } from '@routes/paths';

const MAX_SIZE = 20 * 1024 * 1024;

const BENEFITS = [
  'Works with PDF, Word and plain text, including multi-page scans',
  'Answers are grounded in your document, with the source passage shown',
  'Built for KOI coursework — your files stay on your own Supabase project',
];

const Hero = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const inputRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const { accepted, errors } = validateFiles(Array.from(fileList), { accept: ACCEPTED_TYPES, maxSize: MAX_SIZE });
    if (errors.length) return toast.error(errors[0]);
    if (!accepted.length) return undefined;

    if (!isAuthenticated) {
      toast.info('Sign in first and your document will be waiting in the workspace.');
      return navigate(PATHS.login, { state: { from: PATHS.dashboard } });
    }
    toast.success(`${accepted[0].name} is ready. Continue in the workspace.`);
    return navigate(PATHS.dashboard);
  };

  return (
    <section className="border-b border-line">
      <div className="container-page py-10 sm:py-14">
        <h1 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">Document Summarizer &amp; Q&amp;A</h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="button"
          tabIndex={0}
          aria-label="Choose a document to upload"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (event.dataTransfer.files?.length) handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            'mx-auto mt-8 flex max-w-4xl cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-14 text-center transition-colors sm:py-20',
            isDragging ? 'bg-brand-700' : 'bg-brand-600 hover:bg-brand-700',
          )}
        >
          <div className="pointer-events-none flex w-full flex-col items-center rounded-lg border-2 border-dashed border-white/45 px-4 py-10 sm:py-12">
            <FileText className="size-12 text-white/90" strokeWidth={1.25} />

            <span className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-bold uppercase tracking-wide text-ink shadow-sm sm:text-base">
              <FilePlus2 className="size-4" />
              Choose files
            </span>

            <p className="mt-4 text-sm text-white/90">or drop files here</p>
            <p className="mt-1 text-xs text-white/70">
              {ACCEPTED_TYPES.join(', ')} · up to {formatBytes(MAX_SIZE)}
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={(event) => {
              if (event.target.files?.length) handleFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-16">
          <p className="text-base leading-relaxed text-slate-600">
            Upload a document and DocuMind AI extracts the text, writes a summary you can check against the source, pulls out the
            entities that matter, and answers your questions using only what the document actually says.
          </p>

          <ul className="flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
