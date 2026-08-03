import BlogClient from "./BlogClient";
import { blogPosts } from "@/lib/blogData";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de Ahorro Energético 2026 | Guías de Tarifas de Luz | TuMejorTarifaLuz',
  description: `${blogPosts.length} guías gratuitas sobre tarifas de luz, horas baratas, PVPC y ahorro energético en España. Actualizadas en 2026 por expertos independientes.`,
  alternates: { canonical: 'https://www.tumejortarifaluz.es/blog' }
}

export default function BlogPage() {
    return <BlogClient />;
}
