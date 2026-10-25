import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, Copy, Mail, Shield, User as UserIcon } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Input } from '@components/ui';
import { formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
import { useUpdateProfileMutation } from '@features/auth/authApi';

const ProfileGeneralPage = () => {
  const { user } = useOutletContext();
  const toast = useToast();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user?.fullName]);

  const handleCopyId = async () => {
    if (!user?.id) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      toast.success('Account ID copied to clipboard');
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.error('Failed to copy account ID');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty');
      return;
    }

    const result = await updateProfile({ fullName: fullName.trim() });
    if (result.error) {
      toast.error(result.error.message || 'Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }
  };

  const hasChanges = (fullName.trim() !== (user?.fullName ?? '').trim());

  return (
    <div className="flex flex-col gap-6">
      {/* Personal Information Form */}
      <Card>
        <CardHeader
          title="Personal Information"
          description="Update your display name and view your registered account details."
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<UserIcon className="size-4" />}
              hint="Your display name visible on the dashboard and shared reports."
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={user?.email ?? ''}
              disabled
              leftIcon={<Mail className="size-4" />}
              hint="Email address cannot be changed directly as it is tied to your login identity."
            />

            <div className="flex flex-col gap-1.5 sm:w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account ID</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={user?.id ?? ''}
                  className="w-full rounded-lg border border-line bg-slate-50 dark:bg-slate-900 dark:border-slate-800 px-3 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyId}
                  leftIcon={copiedId ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                  className="shrink-0"
                >
                  {copiedId ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-slate-400">Unique identifier for your DocuMind user account.</p>
            </div>

            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={!hasChanges}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Account Status and Security Overview */}
      <Card>
        <CardHeader
          title="Account Details"
          description="Metadata and security tier information for your account."
        />
        <CardBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line/80 bg-surface-muted/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Account Role</dt>
              <dd className="mt-1.5 flex items-center gap-2">
                <Badge tone={user?.role === 'ADMIN' ? 'brand' : 'neutral'}>
                  {user?.role ?? 'USER'}
                </Badge>
                <span className="text-xs text-slate-500">
                  {user?.role === 'ADMIN' ? 'Full platform access' : 'Standard NLP document access'}
                </span>
              </dd>
            </div>

            <div className="rounded-lg border border-line/80 bg-surface-muted/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Account Status</dt>
              <dd className="mt-1.5 flex items-center gap-2">
                <Badge tone="success">Active</Badge>
                <span className="text-xs text-slate-500">Good standing</span>
              </dd>
            </div>

            <div className="rounded-lg border border-line/80 bg-surface-muted/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Registered On</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {user?.createdAt ? formatDate(user.createdAt) : '—'}
              </dd>
            </div>

            <div className="rounded-lg border border-line/80 bg-surface-muted/50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Login</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {user?.lastLoginAt ? formatDate(user.lastLoginAt) : 'Current active session'}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileGeneralPage;
