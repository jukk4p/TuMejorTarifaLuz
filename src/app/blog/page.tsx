import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog de Ahorro Energético 2026: Guías y Consejos | TuMejorTarifaLuz",
    description: "Aprende a leer tu factura de luz, entiende la diferencia entre mercado libre y regulado, y descubre los mejores trucos para ahorrar energía en casa.",
    alternates: {
        canonical: "https://tumejortarifaluz.es/blog"
    },
    openGraph: {
        title: "Blog de Ahorro Energético — TuMejorTarifaLuz",
        description: "Guías expertas para optimizar tu consumo eléctrico y pagar menos cada mes.",
        url: "https://tumejortarifaluz.es/blog",
        images: [{ url: "/og-image-blog.jpg" }]
    }
};

export default function BlogPage() {
    return <BlogClient />;
}
