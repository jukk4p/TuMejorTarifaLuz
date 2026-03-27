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
    "url": "https://www.tumejortarifaluz.es",
    "logo": "https://www.tumejortarifaluz.es/Logo.png",
    "description": "Comparador independiente de tarifas de luz en España. Ahorra analizando tu factura real.",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Spanish"
    },
    "sameAs": [
        "https://x.com/tumejortarifaluz",
        "https://facebook.com/tumejortarifaluz"
    ]
};

export const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TuMejorTarifaLuz",
    "url": "https://www.tumejortarifaluz.es",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.tumejortarifaluz.es/blog?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
};

export const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Comparador de Tarifas de Luz TuMejorTarifaLuz",
    "url": "https://www.tumejortarifaluz.es/comparador",
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
            "name": "¿Es seguro subir mi factura de la luz?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí, es completamente seguro. Utilizamos cifrado SSL/TLS de nivel bancario para proteger tus archivos. Solo extraemos los datos necesarios para el análisis comparativo y no compartimos tu información personal con terceros bajo ningún concepto."
            }
        },
        {
            "@type": "Question",
            "name": "¿Tengo que pagar por usar el comparador?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, el comparador es completamente gratuito. Es un proyecto independiente diseñado para ayudar a las familias españolas a ahorrar en su factura de la luz. No percibimos ningún tipo de comisión de las comercializadoras."
            }
        },
        {
            "@type": "Question",
            "name": "¿Las tarifas están actualizadas?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí, revisamos y actualizamos más de 25 tarifas diariamente sincronizando con el mercado mayorista OMIE y las publicaciones oficiales de las comercializadoras eléctricas españolas."
            }
        },
        {
            "@type": "Question",
            "name": "¿Cómo se analizan los datos de mi factura?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nuestro sistema OCR identifica automáticamente el CUPS, la potencia contratada y el consumo horario de tu factura PDF. Estos datos se cruzan con el mercado actual para encontrar la tarifa más barata en segundos."
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
        "item": `https://www.tumejortarifaluz.es${item.item}`
    }))
});

export const getArticleSchema = (post: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": `https://www.tumejortarifaluz.es${post.image}`,
    "author": {
        "@type": "Person",
        "name": post.author.name
    },
    "publisher": {
        "@type": "Organization",
        "name": "TuMejorTarifaLuz",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.tumejortarifaluz.es/Logo.png"
        }
    },
    "datePublished": post.date,
    "description": post.excerpt
});

export const getBlogPostingSchema = (posts: any[]) => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "blogPost": posts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": `https://www.tumejortarifaluz.es${post.image}`,
        "datePublished": post.date,
        "dateModified": post.dateUpdated || post.date,
        "author": {
            "@type": "Person",
            "name": post.author.name
        },
        "publisher": {
          "@type": "Organization",
          "name": "TuMejorTarifaLuz",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.tumejortarifaluz.es/Logo.png"
          }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.tumejortarifaluz.es/blog/${post.slug}`
        }
    }))
});
