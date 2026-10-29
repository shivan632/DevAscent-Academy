import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import CookieConsent from '../components/CookieConsent';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.devascentacademy.me'),
  title: 'DevAscent Academy — Practical Tech Education & Verifiable Certification',
  description: 'Master Full-Stack Web Development, Cloud & Microservices. Build 4 production capstone projects, get weekly live code reviews, and earn an industry-verifiable certificate.',
  keywords: ['DevAscent Academy', 'Full Stack Development', 'Next.js', 'Node.js', 'Prisma', 'PostgreSQL', 'Tech Cohort', 'Coding Bootcamp India', 'Verifiable Certificate'],
  authors: [{ name: 'Shivan Mishra', url: 'https://github.com/shivan632' }, { name: 'DevAscent Academy' }],
  openGraph: {
    title: 'DevAscent Academy — Become a Full-Stack Developer',
    description: 'Build & Ship 4 Production Apps in 6 Weeks. ₹599 Early Bird Pricing with 7-Day Money-Back Guarantee.',
    url: 'https://www.devascentacademy.me',
    siteName: 'DevAscent Academy',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'DevAscent Academy',
    url: 'https://www.devascentacademy.me',
    logo: 'https://www.devascentacademy.me/logo.png',
    description: 'Premier Indian EdTech and Virtual Internship Platform providing verifiable credentials, hands-on production codebases, and mentor support.',
    founder: {
      '@type': 'Person',
      name: 'Shivan Mishra',
      jobTitle: 'Founder & Principal Systems Architect',
      url: 'https://www.devascentacademy.me/about',
      sameAs: [
        'https://github.com/shivan632',
        'https://www.linkedin.com/in/devascent-academy-163a05443'
      ]
    },
    sameAs: [
      'https://www.linkedin.com/in/devascent-academy-163a05443',
      'https://www.instagram.com/devascentacademy',
      'https://github.com/shivan632/DevAscent-Academy',
      'https://discord.gg/devascent',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9935806722',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`dark ${plusJakarta.variable} ${inter.variable} scroll-smooth antialiased`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090D16] text-[#F1F5F9] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <ThemeProvider>
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
