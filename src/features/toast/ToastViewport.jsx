import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@lib/cn';
import { dismissToast, selectToasts } from './toastSlice';

const TONES = {
  success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50', iconClass: 'text-emerald-600' },
  error: { icon: XCircle, className: 'border-red-200 bg-red-50', iconClass: 'text-red-600' },
  warning: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50', iconClass: 'text-amber-600' },
  info: { icon: Info, className: 'border-brand-200 bg-brand-50', iconClass: 'text-brand-600' },
};

const ToastItem = ({ toast, onDismiss }) => {
  const tone = TONES[toast.type] ?? TONES.info;
  const Icon = tone.icon;

  useEffect(() => {
    if (!toast.duration) return undefined;
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn('pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-3 shadow-lg sm:w-96', tone.className)}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', tone.iconClass)} />
      <div className="min-w-0 flex-1">
        {toast.title ? <p className="text-sm font-semibold text-slate-900">{toast.title}</p> : null}
        {toast.message ? <p className="mt-0.5 break-words text-sm text-slate-600">{toast.message}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600"
      >
        <X className="size-4" />
      </button>
    </motion.li>
  );
};

const ToastViewport = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();

  return createPortal(
    <ul role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={(id) => dispatch(dismissToast(id))} />
        ))}
      </AnimatePresence>
    </ul>,
    document.body,
  );
};

export default ToastViewport;
