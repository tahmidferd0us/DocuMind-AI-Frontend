import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, RotateCcw, Sliders, Sparkles } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Select } from '@components/ui';
import { useToast } from '@features/toast/useToast';
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

  const [prefs, setPrefs] = useState({ ...savedPreferences });
  const [isSaved, setIsSaved] = useState(false);

  const handleMethodChange = (method) => {
    setPrefs((prev) => ({ ...prev, defaultSummaryMethod: method }));
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
      defaultSummaryMethod: 'extractive',
      defaultSentenceCount: 5,
      defaultExportFormat: 'markdown',
      defaultQaStyle: 'grounded',
      emailNotifications: true,
      activityLogging: true,
    });
    toast.info('Preferences reset to default values');
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* AI Processing Defaults */}
      <Card>
        <CardHeader
          title="NLP Processing Defaults"
          description="Configure default algorithms and parameters applied when analyzing documents in your workspace."
        />
        <CardBody className="flex flex-col gap-6">
          {/* Summary Method Choice */}
          <div>
            <label className="text-sm font-semibold text-slate-900">Default Summarisation Method</label>
            <p className="mt-0.5 text-xs text-slate-500">
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
                        ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500'
                        : 'border-line bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{method.title}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {method.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{method.description}</p>
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
                <span className="text-sm font-medium text-slate-800">Processing Completion Alerts</span>
                <p className="text-xs text-slate-500">
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
                <span className="text-sm font-medium text-slate-800">Workspace Activity Tracking</span>
                <p className="text-xs text-slate-500">
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
