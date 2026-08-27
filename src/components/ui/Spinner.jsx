import { cn } from '@lib/cn';

const SIZES = { xs: 'size-3 border-[1.5px]', sm: 'size-4 border-2', md: 'size-5 border-2', lg: 'size-8 border-[3px]' };

const Spinner = ({ size = 'sm', className, label = 'Loading' }) => (
  <span role="status" aria-label={label} className={cn('inline-block animate-spin rounded-full border-current border-t-transparent', SIZES[size], className)} />
);

export default Spinner;
