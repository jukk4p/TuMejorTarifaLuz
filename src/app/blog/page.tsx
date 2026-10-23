import BlogClient from "./BlogClient";
import { blogPosts } from "@/lib/blogData";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de Ahorro Energético: Tarifas de Luz',
  description: `${blogPosts.length} guías gratuitas sobre tarifas de luz, horas baratas, PVPC y ahorro energético en España. Actualizadas en 2026 por expertos independientes.`,
  alternates: { canonical: 'https://www.tumejortarifaluz.es/blog' },
  openGraph: {
    title: 'Blog de Ahorro Energético: Tarifas de Luz',
    description: `${blogPosts.length} guías gratuitas sobre tarifas de luz, horas baratas, PVPC y ahorro energético en España.`,
    url: 'https://www.tumejortarifaluz.es/blog',
    type: 'website',
  },
}

export default function BlogPage() {
    return <BlogClient />;
}
