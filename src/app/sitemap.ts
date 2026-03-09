import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blogData';
import { providers } from '@/app/companias/providersData';

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
        '/contacto',
        '/guias',
        '/legal/aviso-legal',
        '/legal/cookies',
        '/legal/privacidad'
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

    // Dynamic providers routes
    const providerRoutes = providers.map((provider) => ({
        url: `${baseUrl}/companias/${provider.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes, ...providerRoutes];
}
