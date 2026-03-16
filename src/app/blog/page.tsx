import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Blog de Ahorro Energético 2026: Guías sobre Tarifas de Luz | TuMejorTarifaLuz',
  description: 'Guías expertas sobre tarifas de luz, PVPC, discriminación horaria y cómo elegir la mejor tarifa eléctrica en España en 2026.',
  alternates: {
    canonical: 'https://tumejortarifaluz.es/blog'
  }
}

export default function BlogPage() {
    return <BlogClient />;
}
