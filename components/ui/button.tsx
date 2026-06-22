import * as React from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-cj-gold bg-brand-purple px-6 py-2.5 text-brand-parchment hover:border-cj-gold-bright hover:bg-brand-purple-muted",
        secondary:
          "border border-cj-border bg-transparent px-6 py-2.5 text-cj-text hover:border-cj-gold hover:bg-cj-gold/5",
        ghost:
          "px-4 py-2 font-medium text-cj-text-muted hover:bg-cj-surface-elevated hover:text-cj-text",
        outline:
          "border border-cj-border px-4 py-2 text-cj-text hover:border-cj-gold hover:bg-cj-gold/5",
        destructive:
          "border border-brand-purple-deep bg-brand-purple-deep/30 px-6 py-2.5 text-brand-parchment hover:bg-brand-purple-deep/50",
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

type ButtonLinkProps = LinkProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: React.ReactNode;
  };

function ButtonLink({ className, variant, size, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  );
}

export { Button, ButtonLink, buttonVariants };
