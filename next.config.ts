import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-d5a0449eb42449d1aa837683fccbba9a.r2.dev',
      },
    ],
  },
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
