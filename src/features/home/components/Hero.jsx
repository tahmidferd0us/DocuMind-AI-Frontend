import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, FileSearch, MessageSquareQuote, ScrollText, Tags } from 'lucide-react';
import { Badge, Button } from '@components/ui';
import { PATHS } from '@routes/paths';

const PILLARS = [
  { icon: ScrollText, title: 'Summarise', copy: 'Extractive and abstractive summaries of long, multi-page documents.' },
  { icon: MessageSquareQuote, title: 'Ask', copy: 'Retrieval-grounded answers that cite the passages they came from.' },
  { icon: Tags, title: 'Extract', copy: 'Key phrases and named entities surfaced automatically.' },
  { icon: FileSearch, title: 'Export', copy: 'Take summaries, entities and Q&A history away as a report.' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 h-[28rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-brand-100),transparent_70%)]" />

    <div className="container-page relative py-16 sm:py-20 lg:py-28">
      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.08 }} className="mx-auto max-w-3xl text-center">
        <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
          <Badge tone="brand">Smart NLP Platform · KOI</Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Read less. Understand more.
        </motion.h1>

        <motion.p variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
          Upload a PDF, Word file or plain text. DocuMind AI extracts the content, writes a summary you can trust, pulls out the entities that matter, and answers your questions using only what the document actually says.
        </motion.p>

        <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" fullWidth className="sm:w-auto" rightIcon={<ArrowRight className="size-4" />} onClick={() => navigate(PATHS.login)}>
            Get started
          </Button>
          <Link
            to={`${PATHS.home}#how-it-works`}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-line bg-white px-6 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
          >
            See how it works
          </Link>
        </motion.div>
      </motion.div>

      <motion.ul
        id="how-it-works"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: 0.08 }}
        className="mx-auto mt-14 grid max-w-5xl scroll-mt-24 gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PILLARS.map((pillar) => (
          <motion.li
            key={pillar.title}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-card border border-line bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <pillar.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">{pillar.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{pillar.copy}</p>
          </motion.li>
        ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default Hero;
