import { Link } from 'react-router-dom';
import { APP_NAME } from '@lib/constants';
import { TOOLS } from '@lib/tools';
import { PATHS } from '@routes/paths';

const Wordmark = () => (
  <span className="flex items-center gap-2 font-semibold tracking-tight text-ink">
    <span className="grid size-8 shrink-0 grid-cols-2 gap-0.5 rounded-md p-1.5">
      <span className="rounded-[2px] bg-brand-600" />
      <span className="rounded-[2px] bg-emerald-500" />
      <span className="rounded-[2px] bg-amber-400" />
      <span className="rounded-[2px] bg-red-500" />
    </span>
    {APP_NAME}
  </span>
);

const Footer = () => (
  <footer className="bg-surface-muted">
    <div className="container-page py-12 sm:py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to={PATHS.home}>
            <Wordmark />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            Upload a document, get a grounded summary, the entities that matter, and answers you can trace back to the source.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Tools</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {TOOLS.map((tool) => (
              <li key={tool.key}>
                <Link to={tool.path} className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                  {tool.name}
                  {tool.ready ? null : <span className="ml-1.5 text-xs text-slate-400">soon</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Account</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link to={PATHS.login} className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                Log in
              </Link>
            </li>
            <li>
              <Link to={PATHS.dashboard} className="text-sm text-slate-500 transition-colors hover:text-brand-700">
                Workspace
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Project</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <li>King&apos;s Own Institute</li>
            <li>Smart NLP Platform</li>
            <li>Document Summarisation &amp; Q&amp;A</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {APP_NAME}. Built for KOI.
        </p>
        <p>Academic project — not a commercial service.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
