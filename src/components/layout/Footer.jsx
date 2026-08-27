import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { APP_NAME } from '@lib/constants';
import { PATHS } from '@routes/paths';

const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', to: PATHS.home },
      { label: 'How it works', to: `${PATHS.home}#how-it-works` },
      { label: 'Dashboard', to: PATHS.dashboard },
    ],
  },
  {
    title: 'Capabilities',
    links: [
      { label: 'Summarisation', to: `${PATHS.home}#how-it-works` },
      { label: 'Question answering', to: `${PATHS.home}#how-it-works` },
      { label: 'Report export', to: `${PATHS.home}#how-it-works` },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: "King's Own Institute", to: PATHS.home },
      { label: 'Sign in', to: PATHS.login },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-line bg-surface-muted">
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to={PATHS.home} className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Sparkles className="size-4" />
            </span>
            {APP_NAME}
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            Upload a document, get a grounded summary, key entities and answers you can trace back to the source.
          </p>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-900">{section.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={`${section.title}-${link.label}`}>
                  <Link to={link.to} className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {APP_NAME}. Built for KOI.
        </p>
        <p>Smart NLP Platform for Automatic Document Summarisation and Q&amp;A</p>
      </div>
    </div>
  </footer>
);

export default Footer;
