"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Cookies() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="premium-card p-12 md:p-16 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 space-y-12">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-800 text-slate-900 dark:text-white uppercase tracking-tight">Política de Cookies</h1>
                            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Última actualización: Marzo 2026</p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-xl font-bold mb-4">1. ¿Qué son las Cookies?</h2>
                            <p className="mb-8">
                                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar información sobre tu visita, como tus preferencias o el estado de tu sesión.
                            </p>

                            <h2 className="text-xl font-bold mb-4">2. Cookies que utilizamos</h2>
                            <p className="mb-8">
                                Utilizamos cookies técnicas esenciales para el funcionamiento del comparador y cookies de personalización para recordar tus ajustes de tema (claro/oscuro). También utilizamos cookies analíticas anónimas (Google Analytics) para entender cómo interactúan los usuarios con nuestra web y mejorar nuestro servicio.
                            </p>

                            <h2 className="text-xl font-bold mb-4">3. Gestión de Cookies</h2>
                            <p className="mb-8">
                                Puedes configurar tu navegador para bloquear o ser avisado de la presencia de cookies. Ten en cuenta que, si bloqueas determinadas cookies técnicas, algunas funcionalidades de nuestro comparador podrían dejar de funcionar correctamente.
                            </p>

                            <h2 className="text-xl font-bold mb-4">4. Consentimiento</h2>
                            <p className="mb-8">
                                Al navegar por nuestro sitio web, aceptas el uso de cookies según lo descrito en esta política. Puedes revocar tu consentimiento en cualquier momento eliminando las cookies almacenadas en tu navegador.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
