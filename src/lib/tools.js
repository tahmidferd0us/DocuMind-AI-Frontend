import { BarChart3, FileDown, MessagesSquare, ScrollText, Tags, Upload } from 'lucide-react';
import { PATHS } from '@routes/paths';

export const ACCEPTED_TYPES = ['.pdf', '.docx', '.txt'];
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const TOOLS = [
  {
    key: 'upload',
    name: 'Upload',
    path: PATHS.upload,
    tagline: 'Ingest PDF, DOCX and TXT',
    icon: Upload,
    illustration: 'summary',
    ready: true,
    headline: 'Upload a document to get started',
    blurb:
      'Drop in a PDF, Word file or plain text document. DocuMind extracts the text, normalises spacing and encoding, and keeps the page structure so later answers can point back to where they came from.',
    benefits: ['PDF, DOCX and TXT up to 20 MB', 'Multi-page documents handled page by page', 'Text normalisation and boilerplate removal'],
    points: ['Encoding and whitespace cleaned on ingest', 'Page numbers preserved for citations', 'Original file stored against your account'],
  },
  {
    key: 'summarize',
    name: 'Summarize',
    path: PATHS.summarize,
    tagline: 'Extractive and abstractive',
    icon: ScrollText,
    illustration: 'summary',
    ready: false,
    headline: 'Two summaries, so you can check the machine',
    blurb:
      'DocuMind produces an extractive summary built from the document’s own highest-ranked sentences, and an abstractive one written fresh. Reading them side by side makes it obvious when the model has drifted from the source.',
    benefits: ['Extractive pass never invents wording', 'Abstractive pass reads naturally', 'Adjustable length for skimming or detail'],
    points: ['Sentence ranking runs over the cleaned text', 'Abstractive summary generated from the same source', 'Both summaries exportable in the final report'],
  },
  {
    key: 'ask',
    name: 'Ask',
    path: PATHS.ask,
    tagline: 'Grounded question answering',
    icon: MessagesSquare,
    illustration: 'ask',
    ready: false,
    headline: 'Answers grounded in your document',
    blurb:
      'Questions are answered with retrieval-augmented generation: the document is chunked and embedded, the passages most relevant to your question are pulled back, and the answer is written only from those passages.',
    benefits: ['Every answer cites the passage it came from', 'Says so when the document does not contain the answer', 'Follow-up questions keep the conversation in context'],
    points: ['Chunking tuned for retrieval, not display', 'Similarity search over stored embeddings', 'Full Q&A transcript kept with the document'],
  },
  {
    key: 'entities',
    name: 'Entities',
    path: PATHS.entities,
    tagline: 'Keywords and named entities',
    icon: Tags,
    illustration: 'entities',
    ready: false,
    headline: 'The names, places and terms that matter',
    blurb:
      'Key phrases and named entities are extracted automatically, so you can see at a glance what a document is really about before reading a word of it.',
    benefits: ['People, organisations, locations and dates', 'Domain-relevant key phrases, not just frequent words', 'Filter and search the document by any entity'],
    points: ['Named-entity recognition across the full text', 'Key-phrase ranking rather than raw word counts', 'Entities linked back to the passages that mention them'],
  },
  {
    key: 'analytics',
    name: 'Analytics',
    path: PATHS.analytics,
    tagline: 'Reading metrics and topics',
    icon: BarChart3,
    illustration: 'entities',
    ready: false,
    headline: 'Know the shape of a document before you read it',
    blurb:
      'Word count, estimated reading time and topic breakdown for every document you have processed, collected into one dashboard.',
    benefits: ['Word count and estimated reading time', 'Topic clusters across your library', 'Entity frequency at a glance'],
    points: ['Statistics computed on ingest, not on demand', 'Comparable across every document you upload', 'Feeds the figures included in exported reports'],
  },
  {
    key: 'export',
    name: 'Export',
    path: PATHS.export,
    tagline: 'PDF and DOCX reports',
    icon: FileDown,
    illustration: 'export',
    ready: false,
    headline: 'Take the whole analysis with you',
    blurb:
      'Summaries, extracted entities and your full question-and-answer history export together into a single formatted report you can submit or share.',
    benefits: ['PDF and DOCX output', 'Includes the Q&A transcript with citations', 'Reading metrics and document statistics attached'],
    points: ['One report covering every stage of the pipeline', 'Formatted for submission, not raw text', 'Regenerates as you add more questions'],
  },
];

export const PRIMARY_TOOLS = TOOLS.filter((tool) => ['summarize', 'ask', 'entities', 'export'].includes(tool.key));

export const getTool = (key) => TOOLS.find((tool) => tool.key === key);
