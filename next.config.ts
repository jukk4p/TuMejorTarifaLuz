import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
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
        source: '/blog/mercado-libre-vs-regulado',
        destination: '/blog/mercado-libre-vs-pvpc-cual-es-mejor-para-ti',
        permanent: true,
      },
      {
        source: '/blog/mercado-libre-vs-pvpc-cual-es-mejor-para-ti',
        destination: '/blog/mercado-libre-pvpc',
        permanent: true,
      },
      {
        source: '/blog/optimizacion-potencia-ahorro',
        destination: '/blog/como-reducir-potencia-contratada-luz-ahorrar',
        permanent: true,
      },
      {
        source: '/blog/discriminacion-horaria-estrategias',
        destination: '/blog/discriminacion-horaria-horas-valle-llano-punta-como-ahorrar',
        permanent: true,
      },
      {
        source: '/blog/autoconsumo-solar-pisos',
        destination: '/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad',
        permanent: true,
      },
      {
        source: '/blog/guia-carga-coche-electrico',
        destination: '/blog/mejor-tarifa-luz-coche-electrico-recarga-nocturna',
        permanent: true,
      },
      {
        source: '/blog/que-es-el-pvpc-y-como-funciona-la-nueva-tarifa-regulada',
        destination: '/blog/que-es-el-pvpc-nueva-tarifa-regulada-2026-ahorro',
        permanent: true,
      },
      {
        source: '/companias/chc-energia',
        destination: '/companias',
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
        destination: '/blog/discriminacion-horaria-horas-valle-llano-punta-como-ahorrar',
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
        source: '/guias',
        destination: '/blog',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
