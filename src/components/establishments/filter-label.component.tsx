import type { FC, ReactNode } from 'react';

interface FilterLabelProps {
  children: ReactNode;
}

const FilterLabel: FC<FilterLabelProps> = ({ children }) => (
  <span className='text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60 mb-1.5 block'>
    {children}
  </span>
);

export default FilterLabel;
