import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from '@lib/tools';
import { UploadDropzone } from '@components/ui';
import { useDocumentIntake } from '@features/upload/useDocumentIntake';

const BENEFITS = [
  'Works with PDF, Word and plain text, including multi-page documents',
  'Answers are grounded in your document, with the source passage shown',
  'Built for KOI coursework — your files stay on your own Supabase project',
];

const Hero = () => {
  const { onFiles, isUploading } = useDocumentIntake();

  return (
    <section className="border-b border-line">
      <div className="container-page py-8 sm:py-12 lg:py-16">
        <h1 className="text-balance text-center text-2xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Document Summarizer &amp; Q&amp;A
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-4xl sm:mt-8"
        >
          <UploadDropzone onFiles={onFiles} accept={ACCEPTED_TYPES} maxSize={MAX_UPLOAD_BYTES} disabled={isUploading} label={isUploading ? 'Uploading…' : 'Choose files'} />
        </motion.div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Upload a document and DocuMind AI extracts the text, writes a summary you can check against the source, pulls out the entities
            that matter, and answers your questions using only what the document actually says.
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
