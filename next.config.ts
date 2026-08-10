import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-d5a0449eb42449d1aa837683fccbba9a.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.google.com; img-src 'self' blob: data: https://lh3.googleusercontent.com https://pub-d5a0449eb42449d1aa837683fccbba9a.r2.dev https://api.dicebear.com https://images.unsplash.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://accounts.google.com; frame-src 'self' https://accounts.google.com${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? ` https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}` : ''};`
          }
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tumejortarifaluz.es' }],
        destination: 'https://www.tumejortarifaluz.es/:path*',
        permanent: true,
      },
      {
        source: '/blog/guia-factura-luz-2026',
        destination: '/blog/como-leer-entender-factura-luz-2026',
        permanent: true,
      },
      {
        source: '/blog/entender-factura-luz-guia-paso-a-paso',
        destination: '/blog/como-leer-entender-factura-luz-2026',
        permanent: true,
      },
      {
        source: '/blog/aerotermia-que-es-ahorro-calefaccion-rentabilidad',
        destination: '/blog/aerotermia-guia-completa-ahorro-climatizacion-2026',
        permanent: true,
      },
      {
        source: '/blog/preguntas-frecuentes-tarifa-de-luz',
        destination: '/blog/preguntas-frecuentes-tarifa-de-luz-2026',
        permanent: true,
      },
      {
        source: '/blog/tarifas-coche-electrico-casa-2026',
        destination: '/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026-rentabilidad-ahorro',
        permanent: true,
      },
      {
        source: '/blog/discriminacion-horaria-luz-como-ahorrar',
        destination: '/blog/preguntas-frecuentes-tarifa-de-luz-2026',
        permanent: true,
      },
      {
        source: '/politica-de-privacidad',
        destination: '/legal/privacidad',
        permanent: true,
      },
      {
        source: '/politica-de-cookies',
        destination: '/legal/cookies',
        permanent: true,
      },
      {
        source: '/terminos-de-uso',
        destination: '/legal/aviso-legal',
        permanent: true,
      },
      {
        source: '/pro',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/mercado-libre-vs-regulado',
        destination: '/blog/mercado-libre-pvpc',
        permanent: true,
      },
      {
        source: '/blog/mercado-libre-vs-pvpc-cual-es-mejor-para-ti',
        destination: '/blog/mercado-libre-pvpc',
        permanent: true,
      },
      {
        source: '/blog/que-es-el-pvpc-y-como-funciona-la-nueva-tarifa-regulada',
        destination: '/blog/mercado-libre-pvpc',
        permanent: true,
      },
      {
        source: '/blog/que-es-el-pvpc-nueva-tarifa-regulada-2026-ahorro',
        destination: '/blog/mercado-libre-pvpc',
        permanent: true,
      },
      {
        source: '/blog/optimizacion-potencia-ahorro',
        destination: '/blog/optimizacion-potencia-luz-2026-ahorro-fijo-icp-maximetro',
        permanent: true,
      },
      {
        source: '/blog/como-reducir-potencia-contratada-luz-ahorrar',
        destination: '/blog/optimizacion-potencia-luz-2026-ahorro-fijo-icp-maximetro',
        permanent: true,
      },
      {
        source: '/blog/discriminacion-horaria-estrategias',
        destination: '/blog/preguntas-frecuentes-tarifa-de-luz-2026',
        permanent: true,
      },
      {
        source: '/blog/horas-baratas-luz-horarios-valle-llano-punta',
        destination: '/blog/preguntas-frecuentes-tarifa-de-luz-2026',
        permanent: true,
      },
      {
        source: '/blog/discriminacion-horaria-horas-valle-llano-punta-como-ahorrar',
        destination: '/blog/preguntas-frecuentes-tarifa-de-luz-2026',
        permanent: true,
      },
      {
        source: '/blog/autoconsumo-solar-pisos',
        destination: '/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad-2026',
        permanent: true,
      },
      {
        source: '/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad',
        destination: '/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad-2026',
        permanent: true,
      },
      {
        source: '/blog/guia-autoconsumo-solar-ahorro-2026',
        destination: '/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad-2026',
        permanent: true,
      },
      {
        source: '/blog/guia-carga-coche-electrico',
        destination: '/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026-rentabilidad-ahorro',
        permanent: true,
      },
      {
        source: '/blog/mejor-tarifa-luz-coche-electrico-recarga-nocturna',
        destination: '/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026-rentabilidad-ahorro',
        permanent: true,
      },
      {
        source: '/companias/chc-energia',
        destination: '/companias',
        permanent: true,
      },
      {
        // Sigue indexada en Google pero ya no está en providersData.
        source: '/companias/neolux-energy',
        destination: '/companias',
        permanent: true,
      },
      {
        source: '/companias/chcenergia',
        destination: '/companias',
        permanent: true,
      },
      {
        source: '/companias/pvpc',
        destination: '/companias/comercializadoras-referencia',
        permanent: true,
      },
      {
        source: '/companias/energianufri',
        destination: '/companias/energia-nufri',
        permanent: true,
      },
      {
        // Google rastreó la variante con tilde. El matcher trabaja sobre la ruta
        // sin descodificar, así que la fuente va percent-encoded.
        source: '/companias/energ%C3%ADa-nufri',
        destination: '/companias/energia-nufri',
        permanent: true,
      },
      {
        source: '/companias/energyavm',
        destination: '/companias/energia-vm',
        permanent: true,
      },
      {
        source: '/companias/totalenergies',
        destination: '/companias/total-energies',
        permanent: true,
      },
      {
        source: '/quienes-somos',
        destination: '/sobre-nosotros',
        permanent: true,
      },
      {
        source: '/nosotros',
        destination: '/sobre-nosotros',
        permanent: true,
      },
      {
        source: '/companias/energía-nufri',
        destination: '/companias/energia-nufri',
        permanent: true,
      },
      {
        source: '/companias/imagina',
        destination: '/companias/imagina-energia',
        permanent: true,
      },
      {
        source: '/5',
        destination: '/',
        permanent: true,
      },
      {
        source: '/guias/guia-factura-luz-2026',
        destination: '/blog/como-leer-entender-factura-luz-2026',
        permanent: true,
      },
      {
        source: '/guias/mercado-libre-vs-regulado',
        destination: '/blog/mercado-libre-pvpc',
        permanent: true,
      },
      {
        source: '/guias/optimizacion-potencia-ahorro',
        destination: '/blog/optimizacion-potencia-luz-2026-ahorro-fijo-icp-maximetro',
        permanent: true,
      },
      {
        source: '/guias/discriminacion-horaria-estrategias',
        destination: '/blog/preguntas-frecuentes-tarifa-de-luz-2026',
        permanent: true,
      },
      {
        source: '/guias/autoconsumo-solar-pisos',
        destination: '/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad-2026',
        permanent: true,
      },
      {
        source: '/guias/guia-carga-coche-electrico',
        destination: '/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026-rentabilidad-ahorro',
        permanent: true,
      },
      {
        source: '/guias/aerotermia',
        destination: '/blog/aerotermia-o-gas-natural-cual-es-mas-barato-2026',
        permanent: true,
      },
      {
        source: '/guias',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/guias/:slug*',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
