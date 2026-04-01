import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormField = ({ children, error, className }: FormFieldProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {children}
    {error && <p className='text-destructive text-xs'>{error}</p>}
  </div>
);
