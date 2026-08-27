import FeatureRow from '../components/FeatureRow';
import Hero from '../components/Hero';
import HowToUse from '../components/HowToUse';
import { AskIllustration, EntitiesIllustration, ExportIllustration, SummaryIllustration } from '../components/Illustrations';

const FEATURES = [
  {
    id: 'summarize',
    eyebrow: 'Summarize',
    title: 'Two summaries, so you can check the machine',
    description:
      'DocuMind produces an extractive summary built from the document’s own highest-ranked sentences, and an abstractive one written fresh. Reading them side by side makes it obvious when the model has drifted from the source.',
    points: ['Handles multi-page PDFs, Word files and plain text', 'Extractive pass never invents wording', 'Adjustable length for skimming or detail'],
    illustration: <SummaryIllustration />,
  },
  {
    id: 'ask',
    eyebrow: 'Ask',
    title: 'Answers grounded in your document',
    description:
      'Questions are answered with retrieval-augmented generation: the document is chunked and embedded, the passages most relevant to your question are pulled back, and the answer is written only from those passages.',
    points: ['Every answer cites the passage it came from', 'Says so when the document does not contain the answer', 'Follow-up questions keep the conversation in context'],
    illustration: <AskIllustration />,
    reversed: true,
  },
  {
    id: 'entities',
    eyebrow: 'Entities',
    title: 'The names, places and terms that matter',
    description:
      'Key phrases and named entities are extracted automatically, so you can see at a glance what a document is really about before reading a word of it.',
    points: ['People, organisations, locations and dates', 'Domain-relevant key phrases, not just frequent words', 'Filter and search the document by any entity'],
    illustration: <EntitiesIllustration />,
  },
  {
    id: 'export',
    eyebrow: 'Export',
    title: 'Take the whole analysis with you',
    description:
      'Summaries, extracted entities and your full question-and-answer history export together into a single formatted report you can submit or share.',
    points: ['PDF and DOCX output', 'Includes the Q&A transcript with citations', 'Reading metrics and document statistics attached'],
    illustration: <ExportIllustration />,
    reversed: true,
  },
];

const HomePage = () => (
  <>
    <Hero />
    {FEATURES.map((feature) => (
      <FeatureRow key={feature.id} {...feature} />
    ))}
    <HowToUse />
  </>
);

export default HomePage;
