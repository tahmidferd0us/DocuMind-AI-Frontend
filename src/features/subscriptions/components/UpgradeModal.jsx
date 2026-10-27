import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { Badge, Button, Modal } from '@components/ui';
import { PATHS } from '@routes/paths';
import { useToast } from '@features/toast/useToast';
import { closeUpgradeModal, selectUpgradeModal } from '../subscriptionsSlice';
import { useCreateCheckoutMutation } from '../subscriptionsApi';

const PRO_PERKS = [
  'Store up to 100 documents (20x more storage)',
  '600 monthly Q&A question interactions',
  'DOCX (Word) & PDF full report exports',
  'Advanced abstractive neural summarization',
  'Comprehensive entity & document analytics',
  'Generous 50MB per-document upload limit',
];

export const UpgradeModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const modal = useSelector(selectUpgradeModal);
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const handleClose = () => dispatch(closeUpgradeModal());

  const handleUpgrade = async () => {
    try {
      const result = await createCheckout({
        tier: 'PRO',
        successUrl: `${window.location.origin}/profile/billing?success=true`,
        cancelUrl: `${window.location.origin}/profile/billing?canceled=true`,
      }).unwrap();

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Could not initiate upgrade checkout.');
    }
  };

  const handleViewPlans = () => {
    handleClose();
    navigate(PATHS.profileBilling);
  };

  const getTitle = () => {
    if (modal.feature === 'docx_export') return 'Upgrade to Export DOCX Documents';
    if (modal.reason === 'QUOTA_EXCEEDED') return 'Plan Limit Reached';
    return 'Upgrade to DocuMind Pro';
  };

  const getDescription = () => {
    if (modal.message) return modal.message;
    if (modal.feature === 'docx_export') {
      return 'DOCX exports are exclusively available on Pro and Enterprise tiers. Upgrade now to download formatted Word documents.';
    }
    return 'You have reached your current plan limits. Upgrade to Pro for high-volume document analysis and premium export formats.';
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleClose}
      title={getTitle()}
      description={getDescription()}
      size="md"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={handleViewPlans} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            Compare all plans <ArrowRight className="ml-1 size-3.5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Maybe later
            </Button>
            <Button
              variant="primary"
              onClick={handleUpgrade}
              isLoading={isLoading}
              leftIcon={<Sparkles className="size-4" />}
            >
              Upgrade to Pro — $29/mo
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50/60 p-4 dark:border-brand-900/60 dark:from-brand-950/40 dark:to-indigo-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600 text-white shadow-xs">
                <Zap className="size-4" />
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">DocuMind Pro</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Everything you need for serious research</p>
              </div>
            </div>
            <Badge tone="brand">Popular</Badge>
          </div>
        </div>

        {/* Feature List */}
        <div className="rounded-xl border border-line bg-surface-muted/50 p-4 dark:bg-slate-900/40">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            What you unlock on Pro
          </h4>
          <ul className="mt-3 space-y-2">
            {PRO_PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
