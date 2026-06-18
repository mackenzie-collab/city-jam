import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy — City Jam",
  description: "How City Jam collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updated="June 18, 2025">
      <p>
        City Jam (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates an audio-first platform for
        musicians to match, jam, collaborate, and share work. This Privacy Policy explains what
        information we collect, how we use it, and your choices. By using City Jam, you agree to
        this policy.
      </p>

      <h2>Who we are</h2>
      <p>
        City Jam is a musician matchmaking and collaboration service hosted at{" "}
        <a href="https://city-jam.vercel.app">city-jam.vercel.app</a>. Contact us at{" "}
        <a href="mailto:privacy@cityjam.app">privacy@cityjam.app</a> or{" "}
        <a href="mailto:contact@cityjam.app">contact@cityjam.app</a>.
      </p>

      <h2>Account types</h2>
      <p>
        City Jam may operate in demo mode (local account stored on your device) or with a connected
        Supabase backend for live features. Demo accounts use a client-generated identifier and do
        not verify email ownership. When full authentication is enabled, accounts will be tied to
        verified credentials. The data described below applies to both modes where relevant.
      </p>

      <h2>Information we collect</h2>
      <h3>Account and profile</h3>
      <ul>
        <li>Email address and display name when you register or sign in</li>
        <li>Profile details you provide: role, genre, city, bio, and status updates</li>
        <li>A client-generated user identifier used to link your activity across features</li>
      </ul>

      <h3>Location (Signal Map)</h3>
      <ul>
        <li>
          When you choose to appear on the Signal Map, we request device geolocation to place you
          at city or neighborhood level — coordinates are rounded; we do not show your exact address
        </li>
        <li>City name and approximate map position while you remain visible</li>
      </ul>

      <h3>Audio and sessions</h3>
      <ul>
        <li>
          Microphone audio during Blind Echo and Echo Roulette jam sessions, transmitted in real time
          via WebRTC peer connections
        </li>
        <li>
          We do not record or store live jam audio on our servers unless you separately upload files
          to the Vault
        </li>
        <li>Audio files you upload to the Vault (demos, stems, recordings) and associated metadata</li>
      </ul>

      <h3>Community and user-generated content</h3>
      <ul>
        <li>Posts on the community feed, circle posts, listening room reactions, and project listings</li>
        <li>Jam activity signals (e.g., streaks, badges) derived from your use of features</li>
        <li>Reports you submit about other users&apos; content</li>
      </ul>

      <h3>Technical data</h3>
      <ul>
        <li>Device and browser type, IP address, and standard server logs via our hosting provider</li>
        <li>Session and matchmaking state stored in Supabase when live backend is configured</li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>Provide matchmaking, live audio sessions, and collaboration tools</li>
        <li>Show your city-level presence on the Signal Map when you opt in</li>
        <li>Display community content, profiles, and discovery features</li>
        <li>Maintain jam streaks, badges, and studio project data</li>
        <li>Review content reports and enforce our Terms</li>
        <li>Improve reliability, security, and the product experience</li>
      </ul>
      <p>We do not sell your personal information. We do not use engagement algorithms or photo-based profiling.</p>

      <h2>Third-party services</h2>
      <ul>
        <li>
          <strong>Supabase</strong> — database, authentication (when enabled), file storage for Vault
          uploads, and realtime features
        </li>
        <li>
          <strong>Vercel</strong> — application hosting and edge delivery
        </li>
        <li>
          <strong>Google STUN</strong> (<code>stun:stun.l.google.com:19302</code>) — helps establish
          WebRTC peer connections for live audio; media flows directly between participants where possible
        </li>
      </ul>
      <p>
        These providers process data according to their own policies. We configure them to support
        City Jam features only.
      </p>

      <h2>Data retention</h2>
      <ul>
        <li>Profile and UGC remain until you delete them or delete your account</li>
        <li>Map presence expires when you hide yourself or after periods of inactivity</li>
        <li>Match queue entries are removed when sessions end or are cancelled</li>
        <li>Server logs are retained for a limited period for security and debugging</li>
        <li>Vault uploads persist until you delete the item or your account</li>
      </ul>

      <h2>Security</h2>
      <p>
        We use HTTPS, row-level security policies on our database (being strengthened as full auth
        rolls out), and access controls on storage buckets. No method of transmission over the Internet
        is 100% secure; please use a strong password when authentication is enabled.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        City Jam is not directed to children under 13. We do not knowingly collect personal information
        from children under 13. If you believe a child under 13 has provided us data, contact{" "}
        <a href="mailto:privacy@cityjam.app">privacy@cityjam.app</a> and we will delete it.
      </p>
      <p>
        Users aged 13–17 may use City Jam with parental permission where required by local law. Live
        audio features with strangers may not be appropriate for all minors; guardians should supervise use.
      </p>

      <h2>Your rights and choices</h2>
      <ul>
        <li>Update profile information in your Profile settings</li>
        <li>Hide from the Signal Map at any time</li>
        <li>Delete Vault uploads from the Vault panel</li>
        <li>
          Delete your account from Profile settings — this removes local session data and deletes
          associated rows in our database where configured
        </li>
        <li>Decline microphone or location permissions in your browser or device settings</li>
        <li>Contact us to request access, correction, or deletion:{" "}
          <a href="mailto:privacy@cityjam.app">privacy@cityjam.app</a>
        </li>
      </ul>
      <p>
        Depending on your location, you may have additional rights under GDPR, CCPA, or similar laws.
        We will respond to verified requests within a reasonable timeframe.
      </p>

      <h2>International transfers</h2>
      <p>
        Data may be processed in the United States and other countries where our service providers
        operate. By using City Jam, you consent to such transfers subject to applicable safeguards.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. We will post the revised version on this page
        with an updated date. Continued use after changes constitutes acceptance.
      </p>

      <p>
        See also our <Link href="/terms">Terms &amp; Conditions</Link> and{" "}
        <Link href="/contact">Contact</Link> page.
      </p>
    </LegalDocument>
  );
}
