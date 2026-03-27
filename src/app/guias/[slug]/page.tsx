"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const REDIRECTS: Record<string, string> = {
    "guia-factura-luz-2026": "/blog/como-leer-entender-factura-luz-2026",
    "mercado-libre-vs-regulado": "/blog/mercado-libre-pvpc",
    "optimizacion-potencia-ahorro": "/blog/optimizacion-potencia-luz-2026-ahorro-fijo-icp-maximetro",
    "discriminacion-horaria-estrategias": "/blog/discriminacion-horaria-horas-valle-llano-punta-como-ahorrar",
    "autoconsumo-solar-pisos": "/blog/autoconsumo-solar-comunidad-vecinos-pisos-rentabilidad-2026",
    "guia-carga-coche-electrico": "/blog/cuanto-cuesta-cargar-coche-electrico-en-casa-2026-rentabilidad-ahorro",
};

export default function GuiaDetalle() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    useEffect(() => {
        const destination = REDIRECTS[slug] || "/blog";
        router.replace(destination);
    }, [slug, router]);

    return (
        <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Redirigiendo a la guía actualizada...</p>
            </div>
        </div>
    );
}
