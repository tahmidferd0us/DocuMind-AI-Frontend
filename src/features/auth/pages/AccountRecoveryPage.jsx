import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import { Button, Input } from '@components/ui';
import { PATHS } from '@routes/paths';
import { useForgotPasswordMutation, useResetPasswordMutation, useResendVerificationMutation, useVerifyEmailMutation } from '../authApi';

const AccountRecoveryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [forgot, forgotState] = useForgotPasswordMutation();
  const [reset, resetState] = useResetPasswordMutation();
  const [verify, verifyState] = useVerifyEmailMutation();
  const [resend, resendState] = useResendVerificationMutation();
  const isReset = location.pathname === PATHS.resetPassword;
  const isVerify = location.pathname === PATHS.verifyEmail;
  const isResend = isVerify && !token;
  const title = isVerify ? 'Verify your email' : isReset ? 'Choose a new password' : 'Reset your password';
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const action = isReset ? reset({ token, password }) : isVerify ? (isResend ? resend({ email }) : verify({ token })) : forgot({ email });
    const result = await action;
    if (result.error) return setError(result.error.message ?? 'Something went wrong. Please try again.');
    const text = result.data?.message ?? 'Request completed.';
    setMessage(text);
    if (isReset || (isVerify && !isResend)) setTimeout(() => navigate(PATHS.login), 1800);
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
      <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {isReset ? 'Enter a new password for your account.' : isVerify ? 'Confirm your email address to keep your account secure.' : 'Enter your account email and we’ll send a secure reset link.'}
      </p>
      {message ? <div role="status" className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</div> : null}
      {error ? <div role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
      {!message && <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {(!isReset && (!isVerify || isResend)) && <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" leftIcon={<Mail className="size-4" />} value={email} onChange={(event) => setEmail(event.target.value)} required />}
        {isReset && <Input label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" leftIcon={<KeyRound className="size-4" />} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />}
        <Button type="submit" size="lg" fullWidth isLoading={forgotState.isLoading || resetState.isLoading || verifyState.isLoading || resendState.isLoading}>
          {isReset ? 'Reset password' : isVerify ? (isResend ? 'Send verification email' : 'Verify email') : 'Send reset link'}
        </Button>
      </form>}
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400"><Link className="font-medium text-brand-600 hover:underline dark:text-brand-400" to={PATHS.login}>Back to log in</Link></p>
    </section>
  );
};

export default AccountRecoveryPage;
