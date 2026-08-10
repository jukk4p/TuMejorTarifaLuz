import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Página no encontrada | TuMejorTarifaLuz",
    description: "La página que buscas no existe o ha cambiado de dirección.",
    robots: { index: false, follow: true },
};

const SUGGESTIONS = [
    { href: "/comparador", label: "Comparador de tarifas", detail: "Encuentra tu mejor tarifa en 2 minutos" },
    { href: "/companias", label: "Compañías de luz", detail: "Análisis y opiniones de 14 comercializadoras" },
    { href: "/precio-luz-hoy", label: "Precio de la luz hoy", detail: "PVPC hora a hora, actualizado a diario" },
    { href: "/blog", label: "Blog", detail: "Guías para entender y bajar tu factura" },
];

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-background pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Error 404</p>
                    <h1 className="text-3xl md:text-5xl font-900 text-text-primary mb-6 leading-[1.15] tracking-tight">
                        Esta página no existe
                    </h1>
                    <p className="text-text-secondary leading-relaxed max-w-2xl mb-12">
                        Puede que el enlace esté mal escrito o que el contenido haya cambiado de dirección.
                        Desde aquí puedes seguir a lo que probablemente buscabas.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {SUGGESTIONS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group p-6 bg-surface/50 rounded-3xl border border-border hover:border-primary transition-colors"
                            >
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <h2 className="text-lg font-900 text-text-primary group-hover:text-primary transition-colors">
                                        {item.label}
                                    </h2>
                                    <ArrowRight size={16} className="text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">{item.detail}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
