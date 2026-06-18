import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Contact — City Jam",
  description: "Get in touch with the City Jam team.",
};

export default function ContactPage() {
  return (
    <LegalDocument title="Contact" updated="June 18, 2025">
      <p>
        City Jam is built for musicians who want to match, jam, and collaborate without the noise of
        traditional social platforms. Reach us using the channels below.
      </p>

      <h2>General inquiries</h2>
      <p>
        <a href="mailto:contact@cityjam.app">contact@cityjam.app</a>
      </p>

      <h2>Privacy and data requests</h2>
      <p>
        For privacy questions, account deletion assistance, or data access requests:{" "}
        <a href="mailto:privacy@cityjam.app">privacy@cityjam.app</a>
      </p>

      <h2>Report abuse</h2>
      <p>
        Use the in-app Report button on posts and reactions. For urgent safety concerns, email{" "}
        <a href="mailto:contact@cityjam.app">contact@cityjam.app</a> with subject line &ldquo;Urgent
        report&rdquo; and include links or descriptions of the content.
      </p>

      <h2>Legal</h2>
      <ul>
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </li>
      </ul>
    </LegalDocument>
  );
}
