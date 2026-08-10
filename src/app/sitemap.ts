import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';
import { providers } from '@/app/companias/providersData';
import tariffs from '@/lib/data.json';

const baseUrl = 'https://www.tumejortarifaluz.es';

// Fecha de la última revisión editorial de las páginas que no dependen de datos
// (home, sobre-nosotros, contacto). Actualízala cuando cambies su contenido:
// mentir aquí hace que Google deje de fiarse de todo el sitemap.
const EDITORIAL_LAST_REVIEW = new Date('2026-08-10');

// Las páginas de tarifas, comparador y compañías se mueven cuando se actualiza
// data.json (npm run update-tariffs), así que heredan esa fecha.
const tariffsLastUpdated = new Date(
  tariffs
    .map((t) => t.updatedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1) ?? EDITORIAL_LAST_REVIEW.toISOString().slice(0, 10)
);

const blogLastUpdated = new Date(
  blogPosts
    .map((post) => post.dateUpdated || post.date)
    .sort()
    .at(-1) ?? EDITORIAL_LAST_REVIEW.toISOString().slice(0, 10)
);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', lastModified: tariffsLastUpdated, changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/comparador', lastModified: tariffsLastUpdated, changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/tarifas', lastModified: tariffsLastUpdated, changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/companias', lastModified: tariffsLastUpdated, changeFrequency: 'weekly' as const, priority: 0.9 },
    // El PVPC cambia cada día a las 20:15, esta sí es diaria de verdad.
    { path: '/precio-luz-hoy', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/blog', lastModified: blogLastUpdated, changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/sobre-nosotros', lastModified: EDITORIAL_LAST_REVIEW, changeFrequency: 'yearly' as const, priority: 0.5 },
    { path: '/contacto', lastModified: EDITORIAL_LAST_REVIEW, changeFrequency: 'yearly' as const, priority: 0.5 },
  ].map(({ path, ...rest }) => ({ url: `${baseUrl}${path}`, ...rest }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateUpdated || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const companyRoutes = providers.map((provider) => ({
    url: `${baseUrl}/companias/${provider.slug}`,
    lastModified: tariffsLastUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...companyRoutes];
}
