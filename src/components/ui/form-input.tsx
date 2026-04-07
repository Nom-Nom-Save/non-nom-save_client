import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const formInputVariants = cva('w-full rounded-xl outline-none transition-colors', {
  variants: {
    variant: {
      default: 'border px-4 py-4 text-base bg-white focus:ring-2 focus:ring-brand-green/30',
      auth: 'border px-4 py-4 text-base bg-white placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-green/30',
      settings:
        'border-[1.5px] px-4 py-4 text-base font-medium bg-brand-cream focus:border-brand-green focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream',
    },
    hasError: {
      true: 'border-destructive',
      false: 'border-border',
    },
  },
  compoundVariants: [
    { variant: 'auth', hasError: true, className: 'bg-destructive/5 focus:ring-destructive/20' },
  ],
  defaultVariants: {
    variant: 'default',
    hasError: false,
  },
});

type FormInputProps = React.ComponentProps<'input'> & VariantProps<typeof formInputVariants>;

export const FormInput = ({ className, variant, hasError, ...props }: FormInputProps) => (
  <input className={cn(formInputVariants({ variant, hasError }), className)} {...props} />
);

export { formInputVariants };
