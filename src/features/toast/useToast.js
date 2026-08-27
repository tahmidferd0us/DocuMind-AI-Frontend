import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { clearToasts, dismissToast, pushToast } from './toastSlice';

export const useToast = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      success: (message, title = 'Success') => dispatch(pushToast({ type: 'success', title, message })),
      error: (message, title = 'Something went wrong') => dispatch(pushToast({ type: 'error', title, message })),
      warning: (message, title = 'Heads up') => dispatch(pushToast({ type: 'warning', title, message })),
      info: (message, title = 'Info') => dispatch(pushToast({ type: 'info', title, message })),
      dismiss: (id) => dispatch(dismissToast(id)),
      clear: () => dispatch(clearToasts()),
    }),
    [dispatch],
  );
};
