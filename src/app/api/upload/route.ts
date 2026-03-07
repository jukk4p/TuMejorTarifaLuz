import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string;

        if (!file || !userId) {
            return NextResponse.json({ error: "Falta el archivo o ID de usuario" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const fileName = `${userId}/${Date.now()}_${file.name}`;

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
