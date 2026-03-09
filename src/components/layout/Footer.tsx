import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-charcoal text-slate-600 dark:text-slate-400 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 active:scale-95 transition-transform flex items-center justify-center overflow-hidden">
                                <Image src="/Logo.png" alt="TuMejorTarifaLuz" width={48} height={48} className="object-contain" />
                            </div>
                            <span className="text-xl font-800 tracking-tight text-slate-900 dark:text-white">
                                TuMejorTarifa<span className="text-primary">Luz</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Lideramos la revolución energética mediante inteligencia artificial. Ayudamos a miles de familias en España a optimizar sus facturas analizando datos reales para encontrar el máximo ahorro garantizado.
                        </p>
                        <div className="flex items-center gap-4 pt-2 justify-center md:justify-start">
                            <a aria-label="Social" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-500 dark:text-slate-300" href="#">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </a>
                            <a aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-transparent flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-500 dark:text-slate-300" href="#">
                                <span className="material-symbols-outlined text-xl">groups</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
                            Enlaces Útiles
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-1/2 h-0.5 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/comparador"><span className="material-icons text-xs">chevron_right</span> Comparador</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/tarifas"><span className="material-icons text-xs">chevron_right</span> Tarifas</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/blog"><span className="material-icons text-xs">chevron_right</span> Blog</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="#faq"><span className="material-icons text-xs">chevron_right</span> Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
                            Legal
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-1/2 h-0.5 bg-primary"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/legal/aviso-legal"><span className="material-icons text-xs">chevron_right</span> Aviso Legal</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/legal/privacidad"><span className="material-icons text-xs">chevron_right</span> Política de Privacidad</Link></li>
                            <li><Link className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2" href="/legal/cookies"><span className="material-icons text-xs">chevron_right</span> Política de Cookies</Link></li>
                            <li>
                                <button
                                    onClick={() => (window as any).openCookieSettings()}
                                    className="text-sm hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 w-full md:w-auto"
                                >
                                    <span className="material-icons text-xs">settings</span>
                                    Gestionar Cookies
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
                            Contacto
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-1/2 h-0.5 bg-primary"></span>
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
                                    <a className="text-sm hover:text-primary transition-colors" href="mailto:hola@tumejortarifaluz.es">hola@tumejortarifaluz.es</a>
                                </div>
                            </li>
                            <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                <span className="material-symbols-outlined text-primary">chat</span>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">WhatsApp</p>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Contactar por WhatsApp</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-xs font-medium text-slate-500">
                        Impulsando un consumo más consciente y eficiente.
                    </p>
                    <div className="flex items-center gap-8 justify-center">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide">© {new Date().getFullYear()} TuMejorTarifaLuz S.L. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
