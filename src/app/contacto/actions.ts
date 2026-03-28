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
                        <h2>Nuevo mensaje desde la web</h2>
                        <p><strong>Nombre:</strong> ${formData.name}</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Motivo:</strong> ${formData.subject}</p>
                        <p><strong>Mensaje:</strong></p>
                        <p>${formData.message.replace(/\n/g, '<br>')}</p>
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
