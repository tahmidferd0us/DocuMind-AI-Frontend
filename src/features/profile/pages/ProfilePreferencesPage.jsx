import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Moon, RotateCcw, Sparkles, Sun } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Select } from '@components/ui';
import { useToast } from '@features/toast/useToast';
import { useTheme } from '@lib/theme';
import {
  resetPreferences,
  selectUserPreferences,
  updatePreferences,
} from '../profileSlice';

const SUMMARY_METHODS = [
  {
    id: 'extractive',
    title: 'Extractive Summarisation',
    description: 'Selects and ranks key sentences directly from the source text, maintaining exact factual phrasing.',
    tag: 'Fast & Grounded',
  },
  {
    id: 'abstractive',
    title: 'Abstractive Summarisation',
    description: 'Rephrases and synthesizes core ideas into fluent paragraphs using natural language generation models.',
    tag: 'High Fluency',
  },
];

const SENTENCE_OPTIONS = [
  { value: '3', label: '3 Sentences — Quick Briefing' },
  { value: '5', label: '5 Sentences — Balanced Overview (Standard)' },
  { value: '7', label: '7 Sentences — Detailed Analysis' },
  { value: '10', label: '10 Sentences — Deep Dive' },
];

const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF Document (.pdf) — Formatted executive analysis report' },
  { value: 'docx', label: 'Word Document (.docx) — Editable Microsoft Word report' },
];

const QA_STYLES = [
  { value: 'grounded', label: 'Strict Grounding — Direct quotes and page citations' },
  { value: 'detailed', label: 'Explanatory — Synthesized response with context' },
];

const ProfilePreferencesPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const savedPreferences = useSelector(selectUserPreferences);
  const { theme, setTheme } = useTheme();

  const [prefs, setPrefs] = useState({ ...savedPreferences, theme });
  const [isSaved, setIsSaved] = useState(false);

  const handleMethodChange = (method) => {
    setPrefs((prev) => ({ ...prev, defaultSummaryMethod: method }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setPrefs((prev) => ({ ...prev, theme: newTheme }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updatePreferences(prefs));
    setIsSaved(true);
    toast.success('Preferences saved successfully');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    dispatch(resetPreferences());
    setPrefs({
      theme,
      defaultSummaryMethod: 'extractive',
      defaultSentenceCount: 5,
      defaultExportFormat: 'pdf',
      defaultQaStyle: 'grounded',
      emailNotifications: true,
      activityLogging: true,
    });
    toast.info('Preferences reset to default values');
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Interface Appearance Defaults */}
      <Card>
        <CardHeader
          title="Interface Appearance"
          description="Choose between light and dark themes. Your choice is remembered across sessions and logins."
        />
        <CardBody className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Color Theme</label>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Customize the look and feel of DocuMind AI to suit your lighting conditions.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                  theme === 'light'
                    ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-500 dark:border-brand-500 dark:bg-brand-950/40'
                    : 'border-line bg-white hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Sun className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Light Mode</span>
                    {theme === 'light' && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Clean, high-clarity appearance recommended for well-lit rooms.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                  theme === 'dark'
                    ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-500 dark:border-brand-500 dark:bg-brand-950/40'
                    : 'border-line bg-white hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Moon className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dark Mode</span>
                    {theme === 'dark' && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Reduced glare and eye strain for night study and low-light environments.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* AI Processing Defaults */}
      <Card>
        <CardHeader
          title="NLP Processing Defaults"
          description="Configure default algorithms and parameters applied when analyzing documents in your workspace."
        />
        <CardBody className="flex flex-col gap-6">
          {/* Summary Method Choice */}
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Default Summarisation Method</label>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Choose the primary summarisation algorithm used for initial document summaries.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SUMMARY_METHODS.map((method) => {
                const selected = prefs.defaultSummaryMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handleMethodChange(method.id)}
                    className={`flex flex-col text-left rounded-xl border p-4 transition-all ${
                      selected
                        ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500 dark:border-brand-500 dark:bg-brand-950/40'
                        : 'border-line bg-white hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{method.title}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {method.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{method.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sentence count */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Default Sentence Count"
              hint="Target sentence count for extractive summaries."
              value={String(prefs.defaultSentenceCount)}
              onChange={(e) =>
                setPrefs((prev) => ({ ...prev, defaultSentenceCount: Number(e.target.value) }))
              }
              options={SENTENCE_OPTIONS}
            />

            <Select
              label="Question Answering Style"
              hint="Control how answers are grounded in document excerpts."
              value={prefs.defaultQaStyle}
              onChange={(e) => setPrefs((prev) => ({ ...prev, defaultQaStyle: e.target.value }))}
              options={QA_STYLES}
            />
          </div>
        </CardBody>
      </Card>

      {/* Export & Data Defaults */}
      <Card>
        <CardHeader
          title="Export & File Defaults"
          description="Standard settings when generating exported summaries and reports."
        />
        <CardBody className="flex flex-col gap-5">
          <Select
            label="Preferred Export Format"
            hint="Default file type selected on the document Export page."
            value={prefs.defaultExportFormat}
            onChange={(e) => setPrefs((prev) => ({ ...prev, defaultExportFormat: e.target.value }))}
            options={EXPORT_FORMATS}
          />

          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.emailNotifications}
                onChange={(e) =>
                  setPrefs((prev) => ({ ...prev, emailNotifications: e.target.checked }))
                }
                className="mt-0.5 size-4 rounded border-line text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Processing Completion Alerts</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receive browser notifications when large document processing completes.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.activityLogging}
                onChange={(e) =>
                  setPrefs((prev) => ({ ...prev, activityLogging: e.target.checked }))
                }
                className="mt-0.5 size-4 rounded border-line text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Workspace Activity Tracking</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track reading stats, word counts, and summary queries on your profile activity dashboard.
                </p>
              </div>
            </label>
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          leftIcon={<RotateCcw className="size-4" />}
        >
          Reset Defaults
        </Button>

        <Button
          type="submit"
          leftIcon={isSaved ? <Check className="size-4" /> : <Sparkles className="size-4" />}
        >
          {isSaved ? 'Saved' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
};

export default ProfilePreferencesPage;
