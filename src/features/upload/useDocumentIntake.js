import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateFiles } from '@components/ui/FileUploader';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from '@lib/tools';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import { useUploadDocumentMutation } from '@features/documents/documentsApi';
import { PATHS, documentPath } from '@routes/paths';

export const useDocumentIntake = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
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
      toast.info(`Extracting text from ${file.name}…`);
      const result = await uploadDocument(file);

      if (result.error) return toast.error(result.error.message);

      toast.success(`${result.data.filename} is ready — ${result.data.wordCount} words across ${result.data.pageCount} page(s).`);
      return navigate(documentPath(result.data.id));
    },
    [isAuthenticated, navigate, toast, uploadDocument],
  );

  return { onFiles, isUploading: isLoading };
};
