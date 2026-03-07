import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/mi-cuenta/'],
        },
        sitemap: 'https://tumejortarifaluz.es/sitemap.xml',
    }
}
