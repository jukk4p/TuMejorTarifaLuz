import React from 'react';

interface JsonLdProps {
    data: any;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// Pre-defined Schemas
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TuMejorTarifaLuz",
    "url": "https://tumejortarifaluz.es",
    "logo": "https://tumejortarifaluz.es/Logo.png",
    "description": "Comparador independiente de tarifas de luz en España. Ahorra analizando tu factura real.",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Spanish"
    }
};

export const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Comparador de Tarifas de Luz TuMejorTarifaLuz",
    "url": "https://tumejortarifaluz.es/comparador",
    "applicationCategory": "UtilityApplication",
    "description": "Herramienta gratuita para comparar tarifas de luz en España subiendo tu factura PDF o introduciendo datos manualmente.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
    },
    "operatingSystem": "Web",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
    }
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "¿Es seguro subir mi factura?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutamente. Utilizamos protocolos de cifrado de nivel bancario (SSL/TLS) para proteger tus archivos. Solo extraemos los datos necesarios para el análisis y no compartimos tu información personal con terceros sin tu consentimiento explícito. Tu privacidad es nuestra prioridad absoluta."
            }
        },
        {
            "@type": "Question",
            "name": "¿Cómo se analizan los datos?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nuestra tecnología de Procesamiento de Datos y OCR de última generación escanea tu factura en milisegundos. Identifica automáticamente tu CUPS, potencia contratada, consumo horario y los conceptos facturados para entender exactamente qué estás pagando y dónde están las oportunidades de ahorro."
            }
        },
        {
            "@type": "Question",
            "name": "¿Tengo que pagar por usar el comparador?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, el uso de nuestra plataforma es 100% gratuito. Este es un proyecto independiente que busca ayudar a los usuarios a ahorrar de forma altruista. Los enlaces que proporcionamos son los oficiales de cada comercializadora y no recibimos comisión alguna por las contrataciones."
            }
        },
        {
            "@type": "Question",
            "name": "¿Las tarifas están actualizadas?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí, nuestra base de datos se sincroniza en tiempo real con las ofertas publicadas por las comercializadoras y el mercado mayorista (OMIE). Revisamos y actualizamos más de 25 tarifas diariamente para asegurarnos de que siempre veas la opción más competitiva disponible en el mercado español."
            }
        }
    ]
};
export const getBreadcrumbSchema = (items: { name: string, item: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `https://tumejortarifaluz.es${item.item}`
    }))
});
