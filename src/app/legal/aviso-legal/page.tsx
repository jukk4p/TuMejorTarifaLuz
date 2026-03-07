"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AvisoLegal() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-background-dark pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="premium-card p-12 md:p-16 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 space-y-12">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-800 text-slate-900 dark:text-white uppercase tracking-tight">Aviso Legal</h1>
                            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Última actualización: Marzo 2026</p>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-xl font-bold mb-4">1. Datos Identificativos</h2>
                            <p className="mb-8">
                                En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos: la empresa titular de dominio web es TuMejorTarifaLuz S.L. (en adelante TuMejorTarifaLuz), con domicilio a estos efectos en Madrid, España. Correo electrónico de contacto: hola@tumejortarifaluz.es.
                            </p>

                            <h2 className="text-xl font-bold mb-4">2. Usuarios</h2>
                            <p className="mb-8">
                                El acceso y/o uso de este portal de TuMejorTarifaLuz atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
                            </p>

                            <h2 className="text-xl font-bold mb-4">3. Uso del Portal</h2>
                            <p className="mb-8">
                                TuMejorTarifaLuz proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a TuMejorTarifaLuz o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
                            </p>

                            <h2 className="text-xl font-bold mb-4">4. Exclusión de Garantías y Responsabilidad</h2>
                            <p className="mb-4">
                                TuMejorTarifaLuz no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
                            </p>
                            <p className="mb-8">
                                Especialmente, el usuario reconoce que la extracción de datos mediante <strong>Inteligencia Artificial</strong> es un proceso automatizado que puede contener errores. Es responsabilidad del usuario validar los datos (potencias y consumos) antes de finalizar cualquier comparativa o contratación.
                            </p>

                            <h2 className="text-xl font-bold mb-4">5. Propiedad Intelectual e Industrial</h2>
                            <p className="mb-8">
                                TuMejorTarifaLuz por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
