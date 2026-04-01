import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        // Brand variants
        brand:
          'bg-brand-green text-white hover:bg-brand-green-hover cursor-pointer disabled:opacity-60',
        'ghost-circle': 'bg-brand-cream border border-border hover:bg-border cursor-pointer',
        'ghost-circle-destructive':
          'bg-brand-cream border border-border hover:bg-destructive/10 cursor-pointer',
        'outline-pill':
          'border-[1.5px] border-border bg-white text-foreground hover:border-brand-green cursor-pointer',
        'brand-outline':
          'border-2 border-brand-green text-brand-green bg-white hover:bg-brand-green hover:text-white cursor-pointer',
        'danger-outline':
          'border-[1.5px] border-destructive/30 bg-white text-destructive cursor-pointer',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        // Brand sizes
        auth: 'w-full rounded-xl py-4.5 text-lg font-semibold',
        dialog: 'w-full rounded-xl py-4 text-base font-semibold',
        settings: 'self-start rounded-full px-7 py-3 text-sm font-bold shadow-md',
        pill: 'rounded-full px-4 py-2 text-[13px] font-semibold',
        'pill-sm': 'rounded-full px-6 py-2.5 text-[13px] font-bold',
        'icon-circle': 'size-[34px] rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
