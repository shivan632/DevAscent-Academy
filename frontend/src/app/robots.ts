import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.devascentacademy.me';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/learn',
          '/learn/*',
          '/checkout',
          '/checkout/*',
          '/certificate',
          '/certificate/*',
          '/api/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/*', '/dashboard/*', '/checkout/*', '/certificate/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
