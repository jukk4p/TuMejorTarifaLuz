import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TuMejorTarifaLuz | Comparador de Tarifas de Luz',
        short_name: 'TuMejorTarifaLuz',
        description: 'Compara tarifas de luz gratis subiendo tu factura y ahorra con el comparador independiente de España.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0F766E',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
