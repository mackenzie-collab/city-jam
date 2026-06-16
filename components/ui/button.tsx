import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-widest transition-opacity disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "rounded bg-cj-gold px-6 py-3 text-cj-purple-card hover:opacity-90",
        secondary: "rounded border border-cj-gold px-6 py-3 text-cj-gold hover:opacity-80",
        ghost: "text-cj-gold hover:opacity-70",
        outline: "rounded border border-cj-gold-border px-4 py-2 text-cj-gold hover:border-cj-gold",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4",
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
