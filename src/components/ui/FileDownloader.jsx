import { useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { httpClient } from '@lib/httpClient';
import Button from './Button';

const filenameFromHeaders = (headers, fallback) => {
  const disposition = headers?.['content-disposition'];
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition ?? '');
  return match ? decodeURIComponent(match[1]) : fallback;
};

export const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const useFileDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const download = useCallback(async (url, { filename = 'download', params } = {}) => {
    setIsDownloading(true);
    setError(null);
    try {
      const response = await httpClient.get(url, { params, responseType: 'blob' });
      saveBlob(response.data, filenameFromHeaders(response.headers, filename));
      return true;
    } catch (caught) {
      setError(caught.response?.data?.message ?? caught.message ?? 'Download failed');
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { download, isDownloading, error };
};

const FileDownloader = ({ url, filename = 'download', params, label = 'Download', variant = 'outline', size = 'md', onError, className, ...props }) => {
  const { download, isDownloading } = useFileDownload();

  const handleClick = async () => {
    const succeeded = await download(url, { filename, params });
    if (!succeeded) onError?.(`Could not download ${filename}`);
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} isLoading={isDownloading} leftIcon={<Download className="size-4" />} className={className} {...props}>
      {label}
    </Button>
  );
};

export default FileDownloader;
