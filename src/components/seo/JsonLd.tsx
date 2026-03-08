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
    "operatingSystem": "Web"
};
