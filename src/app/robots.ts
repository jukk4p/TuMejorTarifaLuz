import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
          '/mi-cuenta/',
          '/admin/',
          '/login/',
          '/registro/',
          '/reset-password/',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot-Extended',
          'Google-Extended',
          'facebookexternalhit',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
          '/mi-cuenta/',
          '/admin/',
          '/login/',
          '/registro/',
          '/reset-password/',
        ],
      }
    ],
    sitemap: 'https://www.tumejortarifaluz.es/sitemap.xml',
  };
}

