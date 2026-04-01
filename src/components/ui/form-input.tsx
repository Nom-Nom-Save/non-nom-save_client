import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const formInputVariants = cva('w-full rounded-xl outline-none transition-colors', {
  variants: {
    variant: {
      // Dialog & general forms: white bg, ring focus
      default: 'border px-4 py-4 text-base bg-white focus:ring-2 focus:ring-brand-green/30',
      // Auth forms: white bg, ring focus, destructive ring on error, placeholder styling
      auth: 'border px-4 py-4 text-base bg-white placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-green/30',
      // Settings forms: cream bg, border focus (no ring)
      settings:
        'border-[1.5px] px-4 py-4 text-base font-medium bg-brand-cream focus:border-brand-green focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-cream',
    },
    hasError: {
      true: 'border-destructive',
      false: 'border-border',
    },
  },
  compoundVariants: [
    // Auth with error: destructive ring + red bg tint
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

// Export variants fn so textareas can reuse the same styling via cn(formInputVariants({...}), 'resize-none')
export { formInputVariants };
