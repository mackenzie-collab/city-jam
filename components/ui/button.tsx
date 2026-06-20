import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-nav transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded bg-cj-gold px-6 py-3 text-cj-purple-card shadow-emboss hover:rotate-[2deg] hover:opacity-95 active:translate-y-0.5 active:shadow-press-collapse",
        secondary:
          "rounded border-2 border-label-cream px-6 py-3 text-cj-gold hover:rotate-[2deg] hover:bg-cj-gold/5 active:translate-y-0.5 active:shadow-press-collapse",
        ghost:
          "rounded border border-transparent px-4 py-2 text-cj-gold hover:border-cj-gold-border hover:bg-cj-gold/5 active:opacity-80",
        outline:
          "rounded border border-cj-gold-border px-4 py-2 text-cj-gold hover:border-cj-gold hover:bg-cj-gold/5",
        destructive:
          "rounded border border-wax-burgundy bg-wax-burgundy/20 px-6 py-3 text-label-cream hover:rotate-[-2deg] hover:bg-wax-burgundy/40 active:shadow-press-collapse",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-base",
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
