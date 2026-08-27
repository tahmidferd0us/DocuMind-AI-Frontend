import { motion } from 'motion/react';
import { FileText, Send } from 'lucide-react';

const STEPS = [
  'Upload a PDF, Word or text document.',
  'Pick a summary style, or type a question about the document.',
  'Wait while DocuMind extracts the text, summarises it and retrieves the passages that answer you.',
  'Export the summary, entities and Q&A history as a report.',
];

const MockApp = () => (
  <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
    <div className="flex items-center gap-1.5 border-b border-line bg-surface-muted px-3 py-2.5">
      <span className="size-2.5 rounded-full bg-red-400" />
      <span className="size-2.5 rounded-full bg-amber-400" />
      <span className="size-2.5 rounded-full bg-emerald-400" />
      <span className="ml-2 truncate text-xs text-slate-500">annual-report-2026.pdf</span>
    </div>

    <div className="grid grid-cols-5">
      <div className="col-span-3 flex flex-col gap-2.5 border-r border-line p-3">
        <div className="ml-auto max-w-[80%] rounded-lg rounded-br-sm bg-brand-600 px-3 py-2 text-[11px] leading-snug text-white">
          What were the three main risks flagged?
        </div>
        <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-surface-muted px-3 py-2">
          <div className="flex flex-col gap-1.5">
            <span className="h-1.5 w-full rounded-full bg-slate-200" />
            <span className="h-1.5 w-[85%] rounded-full bg-slate-200" />
            <span className="h-1.5 w-[92%] rounded-full bg-slate-200" />
            <span className="h-1.5 w-[60%] rounded-full bg-slate-200" />
          </div>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            <FileText className="size-2.5" />
            page 14
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5">
          <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
          <Send className="size-3 text-brand-600" />
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-2 p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Summary</span>
        <span className="h-1.5 w-full rounded-full bg-brand-200" />
        <span className="h-1.5 w-[88%] rounded-full bg-brand-100" />
        <span className="h-1.5 w-[94%] rounded-full bg-brand-100" />

        <span className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Entities</span>
        <div className="flex flex-wrap gap-1">
          {['KOI', 'Sydney', 'Q4', '2026'].map((tag) => (
            <span key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HowToUse = () => (
  <section className="border-b border-line bg-white">
    <div className="container-page py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-5xl items-center gap-8 overflow-hidden rounded-2xl bg-brand-50 lg:grid-cols-2"
      >
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">How to use DocuMind AI</h2>
          <ol className="mt-6 flex flex-col gap-4">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{index + 1}</span>
                <span className="text-sm leading-relaxed text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-6 sm:p-10 lg:pl-0">
          <MockApp />
        </div>
      </motion.div>
    </div>
  </section>
);

export default HowToUse;
