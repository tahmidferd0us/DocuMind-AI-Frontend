import { BarChart3, FileDown, MessagesSquare, ScrollText, Tags, Upload } from 'lucide-react';
import { PATHS } from '@routes/paths';

export const TOOLS = [
  {
    key: 'upload',
    name: 'Upload',
    tagline: 'Ingest PDF, DOCX and TXT',
    description: 'Upload a document and have its text extracted and normalised, including multi-page PDFs.',
    icon: Upload,
    to: PATHS.dashboard,
    ready: true,
  },
  {
    key: 'summarize',
    name: 'Summarize',
    tagline: 'Extractive and abstractive',
    description: 'Condense a long document into a short summary, either by ranking its own sentences or by writing a new one.',
    icon: ScrollText,
    ready: false,
  },
  {
    key: 'ask',
    name: 'Ask',
    tagline: 'Grounded question answering',
    description: 'Ask questions about the document and get answers built only from passages retrieved out of it.',
    icon: MessagesSquare,
    ready: false,
  },
  {
    key: 'entities',
    name: 'Entities',
    tagline: 'Keywords and named entities',
    description: 'Surface the key phrases, topics, people, places and organisations a document actually talks about.',
    icon: Tags,
    ready: false,
  },
  {
    key: 'analytics',
    name: 'Analytics',
    tagline: 'Reading metrics and topics',
    description: 'Word count, reading time and topic breakdown for every document you have processed.',
    icon: BarChart3,
    ready: false,
  },
  {
    key: 'export',
    name: 'Export',
    tagline: 'PDF and DOCX reports',
    description: 'Download the summary, entities and full Q&A history as a formatted report.',
    icon: FileDown,
    ready: false,
  },
];

export const PRIMARY_TOOLS = TOOLS.filter((tool) => ['summarize', 'ask', 'entities', 'export'].includes(tool.key));

export const ACCEPTED_TYPES = ['.pdf', '.docx', '.txt'];
