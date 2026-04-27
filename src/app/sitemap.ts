import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';
import { providers } from '@/app/companias/providersData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tumejortarifaluz.es';

  // Static routes
  const staticRoutes = [
    '',
    '/comparador',
    '/tarifas',
    '/companias',
    '/blog',
    '/sobre-nosotros',
    '/precio-luz-hoy',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateUpdated || post.date),
    changeFrequency: 'weekly' as const, // Forzar rastreo tras gran actualización
    priority: 0.6,
  }));

  // Dynamic company routes
  const companyRoutes = providers.map((provider) => ({
    url: `${baseUrl}/companias/${provider.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...companyRoutes];
}
