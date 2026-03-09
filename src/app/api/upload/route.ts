import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = (formData.get("userId") as string) || "guest";
        const folder = (formData.get("folder") as string) || "";

        if (!file) {
            return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Sanitización profunda de la ruta para asegurar que R2 interprete los slashes como carpetas
        const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");
        // Algunos dashboards de S3/R2 se llevan mejor con carpetas que no contienen caracteres especiales
        const cleanUserId = userId.trim().replace(/[^\w\s-]/g, "_").replace(/^\/+|\/+$/g, "");
        const cleanFileName = file.name.trim().replace(/\s+/g, "_");

        let fileName = "";
        if (cleanFolder) fileName += `${cleanFolder}/`;
        fileName += `${cleanUserId}/${dateStr}_${file.size}_${cleanFileName}`;

        // VERIFICACIÓN DE DUPLICADOS: Si ya existe en R2, no lo volvemos a subir
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
            if (e.name !== "NotFound") {
                console.error("Error comprobando existencia en R2:", e);
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

        const fileUrl = `${process.env.R2_PUBLIC_DOMAIN || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${fileName}`;

        return NextResponse.json({ url: fileUrl, path: fileName });
    } catch (error: any) {
        console.error("Error subiendo a R2:", error);
        return NextResponse.json({ error: "Error en la subida a R2", details: error.message }, { status: 500 });
    }
}
