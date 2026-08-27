import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { APP_NAME } from '@lib/constants';
import { Button, Input } from '@components/ui';
import { useToast } from '@features/toast/useToast';
import { PATHS } from '@routes/paths';
import { useLoginMutation } from '../authApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERKS = [
  'Upload PDF, DOCX and TXT documents',
  'Extractive and abstractive summaries',
  'Question answering grounded in your document',
  'Keyword and named-entity extraction',
  'Reading metrics and document statistics',
  'Export summaries and Q&A history as a report',
];

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    const result = await login({ email: values.email.trim(), password: values.password });

    if (result.error) {
      setErrors(Object.fromEntries((result.error.details ?? []).map((detail) => [detail.field, detail.message])));
      toast.error(result.error.message);
      return;
    }

    toast.success(`Welcome back, ${result.data.data.user.fullName ?? result.data.data.user.email}`);
    navigate(location.state?.from ?? PATHS.dashboard, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-white shadow-sm lg:grid lg:grid-cols-[1fr_20rem]"
    >
      <div className="px-6 py-10 sm:px-12 sm:py-14">
        <div className="mx-auto max-w-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">Log in to {APP_NAME}</h1>
          <p className="mt-2 text-center text-sm text-slate-500">Sign in to keep working on your documents.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="size-4" />}
              value={values.email}
              onChange={setField('email')}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              leftIcon={<KeyRound className="size-4" />}
              value={values.password}
              onChange={setField('password')}
              error={errors.password}
              required
            />

            <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="mt-2">
              Log in
            </Button>
          </form>
        </div>
      </div>

      <aside className="bg-brand-600 px-6 py-10 text-white sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/70">What you get</p>
        <ul className="mt-5 flex flex-col gap-3">
          {PERKS.map((perk) => (
            <li key={perk} className="flex gap-2.5 text-sm leading-relaxed">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
              {perk}
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t border-white/20 pt-6 text-xs leading-relaxed text-white/70">
          Smart NLP Platform for Automatic Document Summarisation and Q&amp;A — King&apos;s Own Institute.
        </p>
      </aside>
    </motion.div>
  );
};

export default LoginPage;
