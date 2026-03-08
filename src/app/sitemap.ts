import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tumejortarifaluz.es';

    // Static routes
    const staticRoutes = [
        '',
        '/comparador',
        '/companias',
        '/blog',
        '/tarifas',
        '/mi-cuenta',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic blog routes
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date.split('/').reverse().join('-')), // Convert DD/MM/YYYY to YYYY-MM-DD
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
}
