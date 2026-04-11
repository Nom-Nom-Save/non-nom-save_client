import { cn } from '@/lib/utils';
import type { FC } from 'react';

interface PillProps {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Pill: FC<PillProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap',
      active && 'bg-brand-green text-white border-brand-green',
      !active && 'bg-white border border-border text-muted-foreground hover:bg-muted/80'
    )}
  >
    {children}
  </button>
);

export default Pill;
