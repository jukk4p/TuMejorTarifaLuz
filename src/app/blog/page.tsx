import BlogClient from "./BlogClient";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de Ahorro Energético 2026: Guías sobre Tarifas de Luz',
  description: 'Guías expertas para ahorrar en tu factura de la luz. PVPC, discriminación horaria, potencia contratada y cómo elegir la mejor tarifa en España.',
  alternates: { canonical: 'https://tumejortarifaluz.es/blog' }
}

export default function BlogPage() {
    return <BlogClient />;
}
