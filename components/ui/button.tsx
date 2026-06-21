import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-full bg-cj-gold px-6 py-2.5 text-cj-on-gold hover:bg-cj-gold-bright",
        secondary:
          "rounded-full border border-cj-border px-6 py-2.5 text-cj-text hover:border-cj-gold hover:bg-cj-gold/5",
        ghost:
          "rounded-md px-4 py-2 font-medium text-cj-text-muted hover:bg-cj-surface-elevated hover:text-cj-text",
        outline:
          "rounded-full border border-cj-border px-4 py-2 text-cj-text hover:border-cj-gold hover:bg-cj-gold/5",
        destructive:
          "rounded-full border border-wax-burgundy bg-wax-burgundy/20 px-6 py-2.5 text-label-cream hover:bg-wax-burgundy/40",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
