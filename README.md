# ⚡ TuMejorTarifaLuz (Web)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

**TuMejorTarifaLuz** es una plataforma avanzada de análisis y comparación de tarifas eléctricas en el mercado español. Diseñada para ofrecer transparencia y ahorro real, permite a los usuarios encontrar la opción más económica entre más de 50 comercializadoras basándose en su consumo real.

---

## ✨ Características Principales

- 🔍 **Comparador Inteligente**: Algoritmos de precisión que calculan el coste anual real (potencia + energía) incluyendo impuestos y cargos regulados.
- 🤖 **IA & OCR Integration**: Integración con **Google Generative AI** para el análisis inteligente de facturas y extracción automática de datos de consumo.
- 🔄 **Asistente de Actualización**: Sistema semiautomatizado (`update-tariffs.js`) que facilita la actualización constante de precios desde las fuentes oficiales.
- 📱 **Diseño Premium & Responsive**: Interfaz moderna construida con **Tailwind 4** y animaciones fluidas con **Framer Motion**.
- ☁️ **Cloud Native**: Infraestructura basada en **Firebase** para persistencia de datos y **AWS S3** para almacenamiento de documentos.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org), [React 19](https://react.dev)
- **Estilos**: [Tailwind CSS 4.0](https://tailwindcss.com)
- **Persistencia**: [Firebase Firestore](https://firebase.google.com)
- **IA**: [Google Generative AI SDK](https://ai.google.dev)
- **Almacenamiento**: [AWS S3](https://aws.amazon.com/s3)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion)
- **Iconografía**: [Lucide React](https://lucide.dev)

---

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 20+
- NPM / PNPM / Bun

### Configuración Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jukk4p/TuMejorTarifaLuz_Web.git
   cd TuMejorTarifaLuz_Web
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env.local` con tus credenciales de Firebase, Google AI y AWS.

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 🛠️ Herramientas: Asistente de Actualización Semiautomatizado

Para garantizar la precisión de los datos sin depender de scrapers frágiles, el proyecto incluye un asistente interactivo que optimiza el proceso de actualización manual.

Para lanzarlo:
```bash
node update-tariffs.js
```

**¿Cómo funciona?**
1. El script lee todas las tarifas configuradas en el sistema.
2. **Automatiza la navegación**: Abre automáticamente en tu navegador la URL oficial de la comercializadora.
3. **Entrada guiada**: Te pide por consola los nuevos valores de potencia y energía para cada periodo (P1, P2, E1, E2, E3).
4. **Validación y Guardado**: Normaliza los decimales y actualiza la fecha de última modificación automáticamente.

---

## 🐳 Despliegue con Docker

El proyecto está preparado para ser desplegado en contenedores:

```bash
docker build -t tumejortarifaluz-web .
docker run -p 3000:3000 tumejortarifaluz-web
```

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

Desarrollado con ❤️ por [Iván González](https://www.ivangonzalez.cloud)
