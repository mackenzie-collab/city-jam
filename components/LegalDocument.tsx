import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import Footer from "@/components/Footer";

interface LegalDocumentProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalDocument({ title, updated, children }: LegalDocumentProps) {
  return (
    <MarketingShell>
      <article className="cj-section">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-cj-gold-muted">
            <Link href="/" className="hover:text-cj-gold">
              City Jam
            </Link>
            {" · "}
            Legal
          </p>
          <h1 className="cj-heading-display mt-4 text-4xl md:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-cj-gold-muted">Last updated: {updated}</p>
          <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-cj-gold-muted [&_h2]:font-display [&_h2]:text-lg [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-cj-gold [&_h3]:mt-6 [&_h3]:text-xs [&_h3]:uppercase [&_h3]:tracking-widest [&_h3]:text-cj-gold [&_li]:ml-4 [&_li]:list-disc [&_p_a]:text-cj-gold [&_p_a]:underline [&_ul]:space-y-2">
            {children}
          </div>
        </div>
      </article>
      <Footer />
    </MarketingShell>
  );
}
