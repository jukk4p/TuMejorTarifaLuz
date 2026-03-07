"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Privacidad() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="premium-card p-12 md:p-16 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 space-y-12">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-800 text-slate-900 dark:text-white uppercase tracking-tight">Política de Privacidad</h1>
                            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Última actualización: Marzo 2026</p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-xl font-bold mb-4">1. Tratamiento de Datos Personales</h2>
                            <p className="mb-8">
                                En TuMejorTarifaLuz nos tomamos muy en serio tu privacidad. Los datos recogidos a través de nuestro comparador (consumos, potencias y datos de factura) se utilizan exclusivamente para realizar el análisis comparativo solicitado y mostrarte las mejores opciones de ahorro.
                            </p>

                            <h2 className="text-xl font-bold mb-4">2. Finalidad del Tratamiento</h2>
                            <p className="mb-8">
                                La finalidad principal es proporcionarte una comparativa precisa de tarifas eléctricas. No vendemos tus datos a terceros ni los utilizamos para fines comerciales ajenos a nuestra plataforma sin tu consentimiento explícito.
                            </p>

                            <h2 className="text-xl font-bold mb-4">3. Conservación de Datos</h2>
                            <p className="mb-8">
                                Los datos de facturas analizadas se conservan de forma anonimizada para mejorar nuestros algoritmos de IA, a menos que el usuario solicite su eliminación completa.
                            </p>

                            <h2 className="text-xl font-bold mb-4">4. Derechos de los Usuarios</h2>
                            <p className="mb-8">
                                De acuerdo con el RGPD, tienes derecho de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición. Puedes ejercer estos derechos enviando un correo a hola@tumejortarifaluz.es adjuntando una copia de tu documento de identidad.
                            </p>

                            <h2 className="text-xl font-bold mb-4">5. Seguridad de la Información</h2>
                            <p className="mb-8">
                                Aplicamos medidas técnicas de última generación, incluyendo cifrado SSL en todas las comunicaciones y almacenamiento en servidores seguros ubicados en la Unión Europea, para garantizar que tu información esté protegida en todo momento.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
