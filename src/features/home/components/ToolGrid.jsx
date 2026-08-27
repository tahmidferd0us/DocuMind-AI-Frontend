import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '@lib/tools';

const ToolGrid = () => (
  <section className="border-b border-line">
    <div className="container-page py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-3xl">Every stage of the pipeline</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          Each stage has its own page. Upload works today; the rest are the modules this project builds next.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool, index) => (
          <motion.div
            key={tool.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35, delay: Math.min(index, 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={tool.path}
              className="group flex h-full flex-col rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <tool.icon className="size-5" />
              </span>

              <span className="mt-4 flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
                {tool.name}
                {tool.ready ? null : (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Soon</span>
                )}
              </span>

              <span className="mt-1.5 text-sm leading-relaxed text-slate-500">{tool.tagline}</span>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ToolGrid;
