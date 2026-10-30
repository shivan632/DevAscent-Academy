import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public Credential & Certificate Verification Ledger | DevAscent Academy',
  description:
    'Verify digital certificates issued by DevAscent Academy. Cryptographically backed by SHA-256 hash validation and immutable records.',
  alternates: {
    canonical: 'https://www.devascentacademy.me/verify',
  },
  openGraph: {
    title: 'Public Credential & Certificate Verification Ledger | DevAscent Academy',
    description:
      'Verify digital certificates issued by DevAscent Academy. Cryptographically backed by SHA-256 hash validation and immutable records.',
    url: 'https://www.devascentacademy.me/verify',
    siteName: 'DevAscent Academy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Public Credential & Certificate Verification Ledger | DevAscent Academy',
    description:
      'Verify digital certificates issued by DevAscent Academy. Cryptographically backed by SHA-256 hash validation and immutable records.',
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

