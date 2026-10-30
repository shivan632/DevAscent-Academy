import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Help Desk & Engineering Support | DevAscent Academy',
  description:
    'Get direct mentor assistance with code bugs, capstone reviews, quiz resets, verified certificates, and our unconditional 7-day money-back guarantee.',
  alternates: {
    canonical: 'https://www.devascentacademy.me/support',
  },
  openGraph: {
    title: 'Student Help Desk & Engineering Support | DevAscent Academy',
    description:
      'Get direct mentor assistance with code bugs, capstone reviews, quiz resets, verified certificates, and our unconditional 7-day money-back guarantee.',
    url: 'https://www.devascentacademy.me/support',
    siteName: 'DevAscent Academy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Help Desk & Engineering Support | DevAscent Academy',
    description:
      'Get direct mentor assistance with code bugs, capstone reviews, quiz resets, verified certificates, and our unconditional 7-day money-back guarantee.',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

