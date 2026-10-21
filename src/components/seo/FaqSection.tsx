import { ChevronDown } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/layout/FadeIn";

interface Faq {
    q: string;
    a: string;
}

interface FaqSectionProps {
    faqs: Faq[];
    title?: string;
    subtitle?: string;
    id?: string;
    muted?: boolean;
}

// Mismo marcado visual que la sección FAQ de la home (src/app/page.tsx), para que
// el contenido que ve el usuario coincida con el FAQPage schema inyectado en cada
// página vía getFaqSchema() — si difieren, el structured data queda "huérfano".
export default function FaqSection({
    faqs,
    title = "Preguntas Frecuentes",
    subtitle,
    id = "faq",
    muted = true,
}: FaqSectionProps) {
    return (
        <section
            id={id}
            className="py-16 md:py-20 scroll-mt-32 transition-colors duration-300"
            style={{ background: muted ? 'var(--color-section-muted)' : 'var(--color-section-white)' }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn className="text-center mb-12">
                    <h2 className="font-heading text-3xl font-semibold text-text-primary mb-4">{title}</h2>
                    {subtitle && <p className="text-lg text-text-secondary">{subtitle}</p>}
                </FadeIn>
                <FadeInStagger className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FadeIn key={i} direction="none">
                            <details
                                className="group overflow-hidden [&_summary::-webkit-details-marker]:hidden rounded-2xl border transition-all duration-300"
                                style={{
                                    background: 'var(--color-section-white)',
                                    borderColor: 'var(--color-border)'
                                }}
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer select-none list-none">
                                    <span className="font-heading text-base font-medium" style={{ color: 'var(--color-text-heading)' }}>{faq.q}</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-open:rotate-180 bg-primary/10 text-primary shrink-0 ml-4">
                                        <ChevronDown size={20} />
                                    </div>
                                </summary>
                                <div className="font-body text-sm font-normal px-6 pb-6 leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                                    {faq.a}
                                </div>
                            </details>
                        </FadeIn>
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}
