import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Programs & Virtual Internships Catalog | DevAscent Academy',
  description:
    'Explore 12+ industry-grade virtual internships and engineering tracks in Web Development, Python, Java, AI, Machine Learning, Cloud, and UI/UX with verified SHA-256 certification.',
  alternates: {
    canonical: 'https://www.devascentacademy.me/courses',
  },
  openGraph: {
    title: 'Engineering Programs & Virtual Internships Catalog | DevAscent Academy',
    description:
      'Explore 12+ industry-grade virtual internships and engineering tracks in Web Development, Python, Java, AI, Machine Learning, Cloud, and UI/UX with verified SHA-256 certification.',
    url: 'https://www.devascentacademy.me/courses',
    siteName: 'DevAscent Academy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Programs & Virtual Internships Catalog | DevAscent Academy',
    description:
      'Explore 12+ industry-grade virtual internships and engineering tracks in Web Development, Python, Java, AI, Machine Learning, Cloud, and UI/UX with verified SHA-256 certification.',
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

