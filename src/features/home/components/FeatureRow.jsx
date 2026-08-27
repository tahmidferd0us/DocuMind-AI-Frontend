import { motion } from 'motion/react';
import { cn } from '@lib/cn';

const FeatureRow = ({ id, eyebrow, title, description, points = [], illustration, reversed = false }) => (
  <section id={id} className="scroll-mt-20 border-b border-line">
    <div className="container-page py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div className={cn(reversed && 'lg:order-2')}>
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p> : null}
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{description}</p>

          {points.length ? (
            <ul className="mt-5 flex flex-col gap-2.5">
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className={cn('flex justify-center', reversed && 'lg:order-1')}>{illustration}</div>
      </motion.div>
    </div>
  </section>
);

export default FeatureRow;
