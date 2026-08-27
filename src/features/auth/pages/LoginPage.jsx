import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { KeyRound, Mail } from 'lucide-react';
import { Button, Input } from '@components/ui';
import { useToast } from '@features/toast/useToast';
import { PATHS } from '@routes/paths';
import { useLoginMutation } from '../authApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      const fieldErrors = Object.fromEntries((result.error.details ?? []).map((detail) => [detail.field, detail.message]));
      setErrors(fieldErrors);
      toast.error(result.error.message);
      return;
    }

    toast.success(`Welcome back, ${result.data.data.user.fullName ?? result.data.data.user.email}`);
    navigate(location.state?.from ?? PATHS.dashboard, { replace: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
      <div className="rounded-card border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to keep working on your documents.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Email address"
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
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to DocuMind AI?{' '}
          <Link to={PATHS.home} className="font-medium text-brand-600 underline-offset-4 hover:underline">
            Learn what it does
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
