import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/comparador?mode=upload',
                '/mi-cuenta/',
            ],
        },
        sitemap: 'https://tumejortarifaluz.es/sitemap.xml',
    };
}
