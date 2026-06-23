import type { CSSProperties, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  as?: "div" | "section";
}

/** Section wrapper — keeps layout API stable; scroll fade removed for reliable visibility. */
export default function FadeIn({
  children,
  className,
  style,
  id,
  as: Tag = "div",
}: FadeInProps) {
  return (
    <Tag id={id} style={style} className={className}>
      {children}
    </Tag>
  );
}
