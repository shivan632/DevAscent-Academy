import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_COURSES_CATALOG } from '../../../lib/courseCatalogData';
import CourseDetailsClient from './CourseDetailsClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COURSES_CATALOG.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = ALL_COURSES_CATALOG.find((c) => c.slug === slug);

  if (!course) {
    return {
      title: 'Course Not Found | DevAscent Academy',
      description: 'The requested engineering program or internship could not be found.',
    };
  }

  const title = `${course.title} | DevAscent Academy`;
  const description = course.description;
  const canonicalUrl = `https://www.devascentacademy.me/courses/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'DevAscent Academy',
      type: 'article',
      images: [
        {
          url: 'https://www.devascentacademy.me/og-preview.png',
          width: 1200,
          height: 630,
          alt: course.title,
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

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = ALL_COURSES_CATALOG.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'DevAscent Academy',
      sameAs: 'https://www.devascentacademy.me',
    },
    offers: {
      '@type': 'Offer',
      price: course.isFree ? 0 : (course.earlyBirdPriceInPaise || 19900) / 100,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://www.devascentacademy.me/courses/${slug}`,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: `P${course.durationWeeks || 4}W`,
    },
  };

  // Strip non-serializable properties (e.g. Lucide icon components)
  const { icon, ...serializableCourse } = course;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      <CourseDetailsClient initialCourse={serializableCourse} slug={slug} />
    </>
  );
}
