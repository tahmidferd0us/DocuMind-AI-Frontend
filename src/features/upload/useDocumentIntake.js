import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validateFiles } from '@components/ui/FileUploader';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from '@lib/tools';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { useUploadDocumentMutation } from '@features/documents/documentsApi';
import { useGetSubscriptionQuery } from '@features/subscriptions/subscriptionsApi';
import { openUpgradeModal } from '@features/subscriptions/subscriptionsSlice';
import { PATHS, documentPath } from '@routes/paths';

export const useDocumentIntake = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { data: subscription } = useGetSubscriptionQuery(undefined, { skip: !isAuthenticated });
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();

  const onFiles = useCallback(
    async (fileList) => {
      const { accepted, errors } = validateFiles(Array.from(fileList), { accept: ACCEPTED_TYPES, maxSize: MAX_UPLOAD_BYTES });
      if (errors.length) return toast.error(errors[0]);
      if (!accepted.length) return undefined;

      if (!isAuthenticated) {
        toast.info('Sign in first, then upload your document.');
        return navigate(PATHS.login, { state: { from: PATHS.dashboard } });
      }

      const file = accepted[0];

      // Pre-check free tier upload size (10MB limit)
      if (subscription?.tier === 'FREE' && file.size > 10 * 1024 * 1024) {
        dispatch(
          openUpgradeModal({
            reason: 'QUOTA_EXCEEDED',
            message: 'Files larger than 10MB require a Pro or Enterprise plan. Upgrade now for up to 50MB per file.',
          }),
        );
        return undefined;
      }

      toast.info(`Extracting text from ${file.name}…`);
      const result = await uploadDocument(file);

      if (result.error) {
        const isQuota = result.error.status === 402 || result.error.code === 'QUOTA_EXCEEDED' || result.error.code === 'UPGRADE_REQUIRED';
        if (isQuota) {
          dispatch(
            openUpgradeModal({
              reason: 'QUOTA_EXCEEDED',
              message: result.error.message || 'You have reached your plan document limit. Please upgrade to Pro for additional storage.',
              limit: result.error.details?.limit,
              current: result.error.details?.current,
            }),
          );
          return undefined;
        }
        return toast.error(result.error.message);
      }

      toast.success(`${result.data.filename} is ready — ${result.data.wordCount} words across ${result.data.pageCount} page(s).`);
      return navigate(documentPath(result.data.id));
    },
    [dispatch, isAuthenticated, navigate, subscription, toast, uploadDocument],
  );

  return { onFiles, isUploading: isLoading };
};
