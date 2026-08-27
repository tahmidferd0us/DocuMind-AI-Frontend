import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateFiles } from '@components/ui/FileUploader';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from '@lib/tools';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { PATHS } from '@routes/paths';

export const useDocumentIntake = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  return useCallback(
    (fileList) => {
      const { accepted, errors } = validateFiles(Array.from(fileList), { accept: ACCEPTED_TYPES, maxSize: MAX_UPLOAD_BYTES });
      if (errors.length) return toast.error(errors[0]);
      if (!accepted.length) return undefined;

      if (!isAuthenticated) {
        toast.info('Sign in first and your document will be waiting in the workspace.');
        return navigate(PATHS.login, { state: { from: PATHS.dashboard } });
      }

      toast.success(`${accepted[0].name} is ready. Continue in the workspace.`);
      return navigate(PATHS.dashboard);
    },
    [isAuthenticated, navigate, toast],
  );
};
