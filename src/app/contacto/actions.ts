"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function submitContactForm(formData: ContactFormData) {
    try {
        // 1. Guardar en Firestore (Siempre seguro)
        const contactsRef = collection(db, "contacts");
        await addDoc(contactsRef, {
            ...formData,
            createdAt: serverTimestamp(),
            status: 'pending'
        });

        // 2. Enviar email vía Resend (usando fetch para no añadir dependencias)
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        
        if (RESEND_API_KEY) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'TuMejorTarifaLuz <notificaciones@tumejortarifaluz.es>',
                    to: ['contacto@tumejortarifaluz.es'],
                    subject: `Nuevo mensaje de contacto: ${formData.subject}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 40px 20px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase;">TuMejorTarifaLuz</h1>
                                <p style="color: #ccfbf1; margin: 10px 0 0 0; font-size: 14px; font-weight: 600; letter-spacing: 0.05em;">NUEVA CONSULTA DE CLIENTE</p>
                            </div>

                            <!-- Content -->
                            <div style="padding: 40px; background-color: #ffffff;">
                                <div style="margin-bottom: 32px;">
                                    <p style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Remitente</p>
                                    <p style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0;">${formData.name}</p>
                                    <p style="color: #0d9488; font-size: 14px; font-weight: 500; margin: 4px 0 0 0;">${formData.email}</p>
                                </div>

                                <div style="margin-bottom: 32px; padding: 20px; background-color: #f1f5f9; border-radius: 16px; border-left: 4px solid #0d9488;">
                                    <p style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">Motivo de la consulta</p>
                                    <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0;">${formData.subject}</p>
                                </div>

                                <div style="margin-bottom: 32px;">
                                    <p style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Mensaje o Comentarios</p>
                                    <div style="color: #334155; font-size: 15px; line-height: 1.6; font-weight: 400; font-style: italic; background-color: #f8fafc; padding: 20px; border-radius: 16px; border: 1px dashed #cbd5e1;">
                                        ${formData.message.replace(/\n/g, '<br>')}
                                    </div>
                                </div>

                                <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 32px; margin-top: 8px;">
                                    <a href="mailto:${formData.email}" style="display: inline-block; background-color: #0d9488; color: #ffffff; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.2);">Responder al cliente ahora</a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                                <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                                    Este es un mensaje automático generado por el formulario de la web.<br>
                                    &copy; 2026 TuMejorTarifaLuz.es - Todos los derechos reservados.
                                </p>
                            </div>
                        </div>
                    `,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error("Error enviando email con Resend:", error);
            }
        } else {
            console.warn("RESEND_API_KEY no configurada. El mensaje se guardó en Firestore pero no se envió email.");
        }

        return { success: true };
    } catch (error: any) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("DEBUG - submitContactForm error details:", {
            name: error?.name,
            code: error?.code,
            message: errorMsg
        });
        return { 
            success: false, 
            error: "Ocurrió un error al enviar el mensaje. Reintenta en unos momentos." 
        };
    }
}
