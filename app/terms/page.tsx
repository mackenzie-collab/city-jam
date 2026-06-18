import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms & Conditions — City Jam",
  description: "Terms of use for City Jam musician matchmaking and collaboration.",
};

export default function TermsPage() {
  return (
    <LegalDocument title="Terms & Conditions" updated="June 18, 2025">
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of City Jam
        (&ldquo;Service&rdquo;). By creating an account or using the Service, you agree to these Terms.
        If you do not agree, do not use City Jam.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 13 years old to use City Jam. If you are between 13 and the age of majority
        in your jurisdiction, you represent that you have parental or guardian consent. You must provide
        accurate account information and keep it updated.
      </p>

      <h2>The Service</h2>
      <p>
        City Jam provides audio-first musician matchmaking, live jam sessions (Blind Echo, Echo Roulette),
        a city-level Signal Map, community features, private circles, listening rooms, a personal Vault
        for audio uploads, and studio collaboration tools. Features may change, and some require a
        configured backend or device permissions (microphone, location).
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Harass, threaten, abuse, or harm other users</li>
        <li>Post spam, scams, or misleading content</li>
        <li>Share illegal content or infringe others&apos; intellectual property</li>
        <li>Record, redistribute, or publish live jam audio without all participants&apos; consent</li>
        <li>Attempt to deanonymize other users or scrape the Service</li>
        <li>Reverse engineer, overload, or interfere with the Service or its infrastructure</li>
        <li>Use the Service for any unlawful purpose</li>
      </ul>
      <p>
        Live audio sessions are intended for musical collaboration. Offensive, sexual, or non-musical
        abuse violates these Terms and may result in immediate account termination.
      </p>

      <h2>User-generated content</h2>
      <p>
        You retain ownership of content you post or upload. By posting, you grant City Jam a non-exclusive,
        worldwide license to host, display, and distribute your content solely to operate the Service
        (e.g., showing community posts, serving Vault files you choose to link to projects).
      </p>
      <p>
        You are responsible for your content and represent that you have the rights to share it.
        We may remove content that violates these Terms or applicable law.
      </p>

      <h2>Reporting and moderation</h2>
      <p>
        Use the Report button on community posts, circle posts, and listening room reactions to flag
        content that violates these Terms. We review reports and may remove content, warn users, or
        terminate accounts. False or abusive reporting may itself result in account action.
      </p>

      <h2>Live audio and WebRTC</h2>
      <p>
        Jam sessions use peer-to-peer audio where possible. Quality and connectivity depend on your
        network and device. City Jam is not responsible for third-party network failures. You are
        responsible for your conduct during live sessions.
      </p>

      <h2>Signal Map and location</h2>
      <p>
        Appearing on the map is optional. Location is shown at city or neighborhood level only.
        Do not use the map to stalk, dox, or harass others.
      </p>

      <h2>Account termination</h2>
      <p>
        You may delete your account at any time from Profile settings. We may suspend or terminate
        accounts that violate these Terms or pose risk to the community. Upon termination, your right
        to use the Service ends; we may delete associated data as described in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES
        OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
        AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED, SECURE, OR ERROR-FREE OPERATION.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, CITY JAM AND ITS OPERATORS WILL NOT BE LIABLE FOR
        ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
        DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM
        RELATING TO THE SERVICE SHALL NOT EXCEED THE GREATER OF USD $100 OR THE AMOUNT YOU PAID US
        IN THE TWELVE MONTHS BEFORE THE CLAIM (TYPICALLY ZERO FOR FREE USE).
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless City Jam from claims arising out of your content,
        your use of the Service, or your violation of these Terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United States, without regard
        to conflict-of-law principles. Disputes shall be resolved in the state or federal courts located
        in Delaware, except where prohibited by local consumer protection laws.
      </p>

      <h2>Changes</h2>
      <p>
        We may modify these Terms at any time. Material changes will be posted on this page. Continued
        use after changes constitutes acceptance.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href="mailto:contact@cityjam.app">contact@cityjam.app</a>. See also{" "}
        <Link href="/privacy">Privacy Policy</Link> and <Link href="/contact">Contact</Link>.
      </p>
    </LegalDocument>
  );
}
