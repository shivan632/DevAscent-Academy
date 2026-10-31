import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioClient from './PortfolioClient';

interface PageProps {
  params: Promise<{ username: string }>;
}

const RESERVED_ROUTES = new Set([
  'about',
  'about-us',
  'admin',
  'ai-studio',
  'api',
  'auth',
  'certificate',
  'checkout',
  'contact',
  'contact-us',
  'cookie-policy',
  'cookies',
  'courses',
  'dashboard',
  'disclaimer',
  'enrolled-courses',
  'internships',
  'learn',
  'login',
  'privacy',
  'profile',
  'refund-policy',
  'register',
  'return-policy',
  'robots.txt',
  'sitemap.xml',
  'support',
  'terms',
  'verify',
]);

function normalizeUsername(raw: string): string {
  if (!raw) return '';
  try {
    const decoded = decodeURIComponent(raw);
    return decoded.replace(/^%40/i, '').replace(/^@/, '').toLowerCase().trim();
  } catch {
    return raw.replace(/^%40/i, '').replace(/^@/, '').toLowerCase().trim();
  }
}

async function fetchPortfolioData(username: string) {
  const cleanHandle = normalizeUsername(username);
  if (!cleanHandle) return null;

  let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devascent-academy.onrender.com/api/v1';
  backendUrl = backendUrl.replace(/\/+$/, '');
  if (!backendUrl.endsWith('/api/v1') && !backendUrl.endsWith('/api')) {
    backendUrl = `${backendUrl}/api/v1`;
  }

  try {
    const res = await fetch(`${backendUrl}/portfolio/public/${encodeURIComponent(cleanHandle)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const cleanHandle = normalizeUsername(username);

  if (RESERVED_ROUTES.has(cleanHandle.toLowerCase())) {
    return { title: 'DevAscent Academy' };
  }

  const data = await fetchPortfolioData(cleanHandle);
  if (!data || data.isPrivate) {
    return {
      title: `@${cleanHandle} — Verified Engineer Profile | DevAscent Academy`,
      description: `View @${cleanHandle}'s verified software engineering portfolio and credentials on DevAscent Academy.`,
    };
  }

  const user = data.user || {};
  const displayName = user.name || cleanHandle;
  const title = `${displayName} (@${cleanHandle}) — Verified Software Engineer | DevAscent`;
  const description =
    user.bio ||
    `Verified engineering portfolio of ${displayName} featuring production capstone codebases, SHA-256 credentials, and full-stack architecture reviews.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.devascentacademy.me/@${cleanHandle}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.devascentacademy.me/@${cleanHandle}`,
      siteName: 'DevAscent Academy',
      type: 'profile',
      images: [
        {
          url: user.avatarUrl || 'https://www.devascentacademy.me/og-preview.png',
          width: 1200,
          height: 630,
          alt: displayName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const cleanHandle = normalizeUsername(username);

  if (RESERVED_ROUTES.has(cleanHandle.toLowerCase())) {
    notFound();
  }

  const data = await fetchPortfolioData(cleanHandle);

  // Fallback placeholder structure for client if backend was unreachable during static pre-render
  const safeData = data || {
    isPrivate: false,
    user: {
      name: cleanHandle
        ? cleanHandle
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
        : 'Developer',
      username: cleanHandle,
      bio: 'Software Engineering Scholar specializing in Production Web & Cloud Architectures.',
      skills: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Docker'],
    },
    verifiedCredentials: [],
    verifiedCapstones: [],
    activeTracks: [],
  };

  return <PortfolioClient initialData={safeData} handle={cleanHandle} />;
}

