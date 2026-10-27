import { Check, CheckCircle2, CreditCard, ExternalLink, HardDrive, HelpCircle, Layers, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Spinner } from '@components/ui';
import { formatBytes, formatDate } from '@lib/format';
import { useToast } from '@features/toast/useToast';
import {
  useCreateCheckoutMutation,
  useCreatePortalMutation,
  useGetSubscriptionQuery,
} from '@features/subscriptions/subscriptionsApi';

const PLANS = [
  {
    tier: 'FREE',
    name: 'Free',
    price: '$0',
    frequency: 'forever free',
    description: 'Essential document intelligence for individuals getting started.',
    highlight: false,
    features: [
      'Up to 5 total documents',
      '10MB maximum upload size',
      '30 Q&A questions / month',
      'Extractive summaries (LexRank & Luhn)',
      'PDF report downloads only',
      'Basic document analytics',
    ],
  },
  {
    tier: 'PRO',
    name: 'Pro',
    price: '$29',
    frequency: 'per month',
    description: 'High-volume storage, deep semantic Q&A, and formatted Word exports.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Up to 100 documents stored',
      '50MB maximum upload size',
      '600 Q&A questions / month',
      'Extractive & abstractive AI summaries',
      'DOCX (Word) & PDF report exports',
      'Comprehensive entity & document analytics',
      'Priority background AI queue',
    ],
  },
  {
    tier: 'ENTERPRISE',
    name: 'Enterprise',
    price: '$99',
    frequency: 'per month',
    description: 'Unlimited capacity, dedicated processing, and tailored compliance.',
    highlight: false,
    features: [
      'Unlimited document storage',
      '200MB maximum upload size',
      'Unlimited Q&A interactions',
      'All AI summary models & custom length',
      'All export formats (DOCX, PDF, raw text)',
      'Full document analytics & entity exploration',
      'Dedicated compute and priority SLA',
    ],
  },
];

const MeterCard = ({ icon: Icon, title, current, max, unit = '', detail, isBytes = false }) => {
  const isUnlimited = max === Infinity || max === null || max === undefined;
  const numericMax = isUnlimited ? 100 : Number(max);
  const numericCurrent = Number(current || 0);

  const percentage = isUnlimited
    ? 0
    : Math.min(100, Math.round((numericCurrent / Math.max(1, numericMax)) * 100));

  const getProgressColor = () => {
    if (isUnlimited) return 'bg-brand-600 dark:bg-brand-500';
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-brand-600 dark:bg-brand-500';
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="flex size-7 items-center justify-center rounded-lg bg-surface-muted text-slate-500 dark:text-slate-400">
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {isBytes ? formatBytes(numericCurrent) : numericCurrent.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          / {isUnlimited ? 'Unlimited' : isBytes ? formatBytes(numericMax) : `${numericMax.toLocaleString()} ${unit}`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${isUnlimited ? 100 : percentage}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{detail}</span>
          {!isUnlimited && <span className="font-medium">{percentage}%</span>}
        </div>
      </div>
    </Card>
  );
};

const ProfileBillingPage = () => {
  const toast = useToast();
  const { data: subStatus, isLoading, isFetching } = useGetSubscriptionQuery();
  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation();
  const [createPortal, { isLoading: isOpeningPortal }] = useCreatePortalMutation();

  const currentTier = subStatus?.tier || 'FREE';
  const usage = subStatus?.usage || {};
  const limits = subStatus?.limits || {};
  const isPaid = currentTier !== 'FREE';

  const handleUpgrade = async (tier) => {
    try {
      const res = await createCheckout({
        tier,
        successUrl: `${window.location.origin}/profile/billing?success=true`,
        cancelUrl: `${window.location.origin}/profile/billing?canceled=true`,
      }).unwrap();

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to start upgrade session.');
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await createPortal({
        returnUrl: `${window.location.origin}/profile/billing`,
      }).unwrap();

      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Could not open billing portal.');
    }
  };

  if (isLoading && !subStatus) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Current Subscription Status Banner */}
      <Card className="overflow-hidden border border-line">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-md">
              <Zap className="size-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
                  {currentTier} Plan
                </h3>
                <Badge tone={isPaid ? 'brand' : 'neutral'}>
                  {subStatus?.status === 'ACTIVE' ? 'Active' : subStatus?.status || 'Active'}
                </Badge>
                {subStatus?.cancelAtPeriodEnd && (
                  <Badge tone="warning">Cancels at period end</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isPaid
                  ? subStatus?.currentPeriodEnd
                    ? `Current billing period ends on ${formatDate(subStatus.currentPeriodEnd)}.`
                    : 'Active subscription renewed monthly.'
                  : 'You are currently on the Free tier with basic limits.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isPaid ? (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                isLoading={isOpeningPortal}
                leftIcon={<CreditCard className="size-4" />}
                rightIcon={<ExternalLink className="size-3.5" />}
              >
                Manage Billing & Invoices
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => handleUpgrade('PRO')}
                isLoading={isCheckingOut}
                leftIcon={<Sparkles className="size-4" />}
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Metered Usage Overview */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Current Metered Usage
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time quota consumption for your account during this billing period.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MeterCard
            icon={Layers}
            title="Documents Stored"
            current={usage?.documentsStored || 0}
            max={limits?.maxDocuments}
            unit="docs"
            detail="Total documents in your workspace"
          />
          <MeterCard
            icon={HelpCircle}
            title="Monthly Q&A Interactions"
            current={usage?.qaQuestionsAsked || 0}
            max={limits?.maxQuestionsPerMonth}
            unit="queries"
            detail="Resets on the 1st of each month"
          />
          <MeterCard
            icon={HardDrive}
            title="Storage Used"
            current={usage?.storageBytesUsed || 0}
            max={limits?.maxUploadSizeBytes}
            isBytes
            detail={`Max ${formatBytes(limits?.maxUploadSizeBytes || 10485760)} per file`}
          />
        </div>
      </div>

      {/* Plan Comparison Cards */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
            Available Plans & Upgrades
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose the entitlement tier that matches your research volume and workflow needs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = currentTier === plan.tier;

            return (
              <div
                key={plan.tier}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all sm:p-8 ${
                  plan.highlight
                    ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20'
                    : 'border-line bg-white dark:bg-slate-900/60 shadow-xs'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plan.name}</h4>
                    {isCurrent && <Badge tone="brand">Current Plan</Badge>}
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                      {plan.price}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      / {plan.frequency}
                    </span>
                  </div>

                  <hr className="my-6 border-line" />

                  {/* Feature checklist */}
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  {isCurrent ? (
                    <Button variant="secondary" disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : isPaid ? (
                    <Button
                      variant={plan.highlight ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={handleManageBilling}
                      isLoading={isOpeningPortal}
                    >
                      Switch Plan in Portal
                    </Button>
                  ) : (
                    <Button
                      variant={plan.highlight ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => handleUpgrade(plan.tier)}
                      isLoading={isCheckingOut}
                      leftIcon={plan.highlight ? <Sparkles className="size-4" /> : undefined}
                    >
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileBillingPage;
