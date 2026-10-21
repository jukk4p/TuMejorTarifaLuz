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
    "operatingSystem": "Web"
};

// Genera un FAQPage schema a partir del mismo array de preguntas que renderiza
// <FaqSection>, para que el structured data nunca quede huérfano del contenido visible.
export const getFaqSchema = (faqs: { q: string; a: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
        }
    }))
});

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
