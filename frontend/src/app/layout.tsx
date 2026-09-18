import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';

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
  title: 'DevAscent Academy — Practical Tech Education & Verifiable Certification',
  description: 'Master Full-Stack Web Development, Cloud & Microservices. Build 4 production capstone projects, get weekly live code reviews, and earn an industry-verifiable certificate.',
  keywords: ['DevAscent Academy', 'Full Stack Development', 'Next.js', 'Node.js', 'Prisma', 'PostgreSQL', 'Tech Cohort', 'Coding Bootcamp India', 'Verifiable Certificate'],
  authors: [{ name: 'DevAscent Academy' }],
  openGraph: {
    title: 'DevAscent Academy — Become a Full-Stack Developer',
    description: 'Build & Ship 4 Production Apps in 6 Weeks. ₹1,499 Early Bird Pricing with 7-Day Money-Back Guarantee.',
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
  return (
    <html lang="en" className={`dark ${plusJakarta.variable} ${inter.variable} scroll-smooth antialiased`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090D16] text-[#F1F5F9] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
