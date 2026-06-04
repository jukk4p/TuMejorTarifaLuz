# ⚡ TuMejorTarifaLuz (Web)

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**TuMejorTarifaLuz** es una aplicación web de alto rendimiento orientada al análisis, comparación y optimización de tarifas eléctricas en el mercado regulado (PVPC) y libre español. El sistema permite a los usuarios comparar y calcular con precisión centesimal sus costes anuales reales de luz a partir de su consumo real.

---

## ✨ Características Principales

- 🔍 **Comparador Inteligente**: Algoritmos de precisión que calculan el coste anual real (potencia + energía) aplicando la normativa e impuestos vigentes (IVA de la luz al **21%** e IEE al **5.11%**).
- 🤖 **IA & OCR Integration**: Integración con **Google Generative AI** para el análisis inteligente de facturas PDF/imágenes y la extracción automática de datos de consumo y periodos de potencia.
- 📢 **Megáfono de Redes Sociales**: Panel de control administrativo con integración directa a **Make.com** para publicar anuncios rápidos en X (Twitter) y Facebook con contadores automáticos de límite de caracteres (280 chars) y plantillas preconfiguradas.
- 🔄 **Detección Automática de Cambios**: Sistema que compara el estado local (`data.json`) contra un snapshot en **Firebase Firestore** para alertar de variaciones de tarifas y notificarlas globalmente.
- 🛠️ **Asistente de Actualización**: Interfaz semiautomatizada interactiva (`update-tariffs.js`) que guía al operador para la carga y mantenimiento de precios de comercializadoras.
- 📱 **Rendimiento y Accesibilidad Móvil**: Código optimizado con técnicas de Lazy Loading, eliminación de bundles redundantes, y excelente contraste visual para cumplir con estándares WCAG y Google Lighthouse.

---

## 🛠️ Stack Tecnológico

- **Frontend & Server**: [Next.js 16 (App Router)](https://nextjs.org), [React 19](https://react.dev)
- **Base de Datos & Sincronización**: [Firebase Firestore](https://firebase.google.com)
- **Motor de Estilos**: [Tailwind CSS 4.0](https://tailwindcss.com) (CSS-first runtime con variables nativas)
- **Inteligencia Artificial**: [Google Generative AI SDK](https://ai.google.dev)
- **Storage**: [AWS S3](https://aws.amazon.com/s3) para resguardar documentos temporales de usuarios
- **Animaciones**: [Framer Motion](https://www.framer.com/motion) y transiciones CSS personalizadas
- **Componentes de Iconos**: [Lucide React](https://lucide.dev)

---

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 20+
- NPM / PNPM / Bun

### Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jukk4p/TuMejorTarifaLuz_Web.git
   cd TuMejorTarifaLuz_Web
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto con la siguiente estructura de ejemplo:
   ```env
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   
   # Google Gemini API
   GEMINI_API_KEY=...
   
   # AWS S3 (Facturas)
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=...
   AWS_BUCKET_NAME=...
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

---

## 👔 Panel de Administración y Automatizaciones

El módulo de administración (`/admin/dashboard`) está diseñado para optimizar el flujo de trabajo de marketing y mantenimiento de tarifas:

### 1. Sincronización de Snapshot
Compara los precios locales contra Firestore. Si detecta diferencias, permite:
- Publicar automáticamente en redes sociales el anuncio de la fluctuación.
- Enviar notificaciones del sistema en tiempo real a los clientes.
- Actualizar el snapshot en la nube con un solo clic.

### 2. Publicación Manual (Megáfono de Redes)
Permite redactar posts personalizados hacia Facebook y X a través de webhooks seguros en Make.com.
- **Validación en tiempo real**: Avisa y resalta el contador en rojo si el contenido supera el límite de 280 caracteres impuesto por X (considerando la URL oficial que el backend añade).
- **Accesos Rápidos**: Botones preconfigurados (`Atulado`, `Bajada de precios` e `Impuestos`) para agilizar la redacción.

---

## 📈 Estándares SEO y Buenas Prácticas de Marcado

El sitio sigue una arquitectura de datos estrictamente alineada con las directrices de calidad de Google (SERP Guidelines):
- **Cero Spam Markup**: Se eliminaron esquemas ocultos y calificaciones agregadas artificiales (`AggregateRating` ficticios o `FAQPage` sin correspondencia visible en el DOM) para evitar penalizaciones manuales de posicionamiento.
- **Esquema de Datos Semántico**: Inyección controlada de metadatos `Organization` y `WebSite` a nivel global (`layout.tsx`) evitando duplicidad en landing pages secundarias.
- **Redirecciones 301**: Control preciso de canibalización de keywords configurado en `next.config.ts`.
- **Sitemap Dinámico**: Reconstrucción en tiempo real (`sitemap.ts`) para incluir artículos de blog y fichas de compañías eléctricas al instante.

---

## 🐳 Despliegue con Docker

Para builds productivos aislados:

```bash
# Construir la imagen
docker build -t tumejortarifaluz-web .

# Ejecutar el contenedor
docker run -p 3000:3000 tumejortarifaluz-web
```

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

Desarrollado con ❤️ por [Iván González](https://www.ivangonzalez.cloud)
