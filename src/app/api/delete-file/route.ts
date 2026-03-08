import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
});

export async function POST(request: Request) {
    try {
        const { path } = await request.json();

        if (!path) {
            return NextResponse.json({ error: "Falta la ruta del archivo" }, { status: 400 });
        }

        // Seguridad: No permitir borrar si está en Facturas_Admin
        if (path.startsWith("Facturas_Admin")) {
            return NextResponse.json({ error: "No tienes permisos para borrar archivos de administración" }, { status: 403 });
        }

        await r2Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: path,
            })
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error borrando de R2:", error);
        return NextResponse.json({ error: "Error en el borrado de R2", details: error.message }, { status: 500 });
    }
}
