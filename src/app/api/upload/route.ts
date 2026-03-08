import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true, // Recomendado para compatibilidad con R2 en ciertos entornos
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = (formData.get("userId") as string) || "guest";
        const folder = formData.get("folder") as string; // Carpeta opcional (ej: Facturas_Admin)

        if (!file) {
            return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Construir la ruta determinista: [Folder/][UserId/]YYYY-MM-DD_Size_Name
        // Usar el tamaño ayuda a diferenciar archivos con el mismo nombre pero distinto contenido
        let fileName = "";
        if (folder) fileName += `${folder}/`;
        fileName += `${userId}/${dateStr}_${file.size}_${file.name}`;

        // VERIFICACIÓN DE DUPLICADOS: Si ya existe en R2, no lo volvemos a subir
        // Esto ahorra ancho de banda y evita archivos repetidos con el mismo nombre determinista
        try {
            const { HeadObjectCommand } = await import("@aws-sdk/client-s3");
            await r2Client.send(new HeadObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
            }));

            // Si no da error, es que el archivo existe
            console.log("El archivo ya existe en R2, saltando subida:", fileName);
            const existingUrl = `${process.env.R2_PUBLIC_DOMAIN || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${fileName}`;
            return NextResponse.json({ url: existingUrl, path: fileName, skipped: true });
        } catch (e: any) {
            // Si el error es 404 (NotFound), procedemos con la subida
            if (e.name !== "NotFound") {
                console.error("Error comprobando existencia en R2:", e);
                // Si es un error raro de conexión, intentamos subir de todos modos
            }
        }

        await r2Client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: Buffer.from(buffer),
                ContentType: file.type,
            })
        );

        // URL del archivo en Cloudflare R2
        // Nota: Para que esta URL sea accesible públicamente, debes configurar un Dominio Personal
        // o usar la URL pública (.r2.dev) si el bucket no contiene datos extremadamente sensibles.
        const fileUrl = `${process.env.R2_PUBLIC_DOMAIN || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${fileName}`;

        return NextResponse.json({ url: fileUrl, path: fileName });
    } catch (error: any) {
        console.error("Error subiendo a R2:", error);
        return NextResponse.json({ error: "Error en la subida a R2", details: error.message }, { status: 500 });
    }
}
