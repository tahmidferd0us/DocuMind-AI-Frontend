import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CheckCircle2, KeyRound, Laptop, Lock, ShieldCheck } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Input } from '@components/ui';
import { formatDate } from '@lib/format';
import { PATHS } from '@routes/paths';
import { useToast } from '@features/toast/useToast';
import { useChangePasswordMutation } from '@features/auth/authApi';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'One number or digit', test: (pwd) => /\d/.test(pwd) },
];

const ProfileSecurityPage = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (!form.newPassword) {
      errs.newPassword = 'New password is required';
    } else {
      if (form.newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters';
      else if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must contain an uppercase letter';
      else if (!/[a-z]/.test(form.newPassword)) errs.newPassword = 'Must contain a lowercase letter';
      else if (!/\d/.test(form.newPassword)) errs.newPassword = 'Must contain a number';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const result = await changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    if (result.error) {
      toast.error(result.error.message || 'Failed to change password');
    } else {
      toast.success('Password changed successfully. Please log in again.');
      navigate(PATHS.login, { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Change Password Card */}
      <Card>
        <CardHeader
          title="Change Password"
          description="Update your password to keep your account protected. You will need to log in again after changing."
        />
        <CardBody>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Enter current password"
              leftIcon={<KeyRound className="size-4" />}
              value={form.currentPassword}
              onChange={setField('currentPassword')}
              error={errors.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              autoComplete="new-password"
              placeholder="Enter new password"
              leftIcon={<Lock className="size-4" />}
              value={form.newPassword}
              onChange={setField('newPassword')}
              error={errors.newPassword}
              required
            />

            {/* Password strength checklist */}
            <div className="rounded-lg border border-line bg-surface-muted/60 p-3.5">
              <p className="text-xs font-semibold text-slate-700">Password Requirements:</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(form.newPassword);
                  return (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        passed ? 'text-emerald-700 font-medium' : 'text-slate-500'
                      }`}
                    >
                      <CheckCircle2 className={`size-3.5 shrink-0 ${passed ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter new password"
              leftIcon={<Lock className="size-4" />}
              value={form.confirmPassword}
              onChange={setField('confirmPassword')}
              error={errors.confirmPassword}
              required
            />

            <div className="mt-2 flex justify-end">
              <Button type="submit" isLoading={isChanging}>
                Update Password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Active Session Card */}
      <Card>
        <CardHeader
          title="Active Session"
          description="Information about your currently authenticated browser session."
        />
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-line bg-surface-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white border border-line text-slate-600 shadow-xs">
                  <Laptop className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Current Web Session</span>
                    <Badge tone="success">Active Now</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authenticated as {user?.email} · JWT Session Token
                  </p>
                  {user?.lastLoginAt && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last logged in: {formatDate(user.lastLoginAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-line bg-brand-50/50 p-4 text-xs text-brand-900">
              <ShieldCheck className="size-5 shrink-0 text-brand-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-brand-950">Security Safeguards Active</p>
                <p className="text-slate-600">
                  Your sessions are protected via cryptographically signed JWT access tokens and secure, HttpOnly refresh cookies with automatic rotation.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileSecurityPage;
