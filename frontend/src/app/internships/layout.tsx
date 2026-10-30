import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Internships & Engineering Programs | DevAscent Academy',
  description:
    'Apply for cohort-based virtual internships in Web Development, Python, Cloud, Java, and AI. Work on real production capstones with mentor code reviews and tamper-proof certificates.',
  alternates: {
    canonical: 'https://www.devascentacademy.me/internships',
  },
  openGraph: {
    title: 'Virtual Internships & Engineering Programs | DevAscent Academy',
    description:
      'Apply for cohort-based virtual internships in Web Development, Python, Cloud, Java, and AI. Work on real production capstones with mentor code reviews and tamper-proof certificates.',
    url: 'https://www.devascentacademy.me/internships',
    siteName: 'DevAscent Academy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Internships & Engineering Programs | DevAscent Academy',
    description:
      'Apply for cohort-based virtual internships in Web Development, Python, Cloud, Java, and AI. Work on real production capstones with mentor code reviews and tamper-proof certificates.',
  },
};

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

