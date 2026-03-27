
import { db } from "./firebase";
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    getDocs,
    doc,
    updateDoc,
    increment,
    deleteDoc
} from "firebase/firestore";

export type NotificationType = 'tariff_update' | 'system_update' | 'price_drop' | 'new_tariff';

export interface Notification {
    id?: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    createdAt: any;
    isGlobal: boolean;
    targetUser?: string; // UID if it's personal
    readBy?: string[]; // Array of UIDs who read it
    hiddenBy?: string[]; // Array of UIDs who dismissed it
    data?: any; // For structured metadata (e.g., price changes)
}

export const createNotification = async (data: Omit<Notification, 'createdAt' | 'readBy'>) => {
    try {
        const notifRef = collection(db, "notifications");
        await addDoc(notifRef, {
            ...data,
            createdAt: serverTimestamp(),
            readBy: [],
            hiddenBy: []
        });
        console.log("Notificación creada con éxito");
    } catch (error) {
        console.error("Error al crear notificación:", error);
    }
};

/**
 * Notifica a los usuarios que una tarifa se ha actualizado
 */
export const notifyTariffUpdate = async (tariffName: string, company: string, changes: string) => {
    await createNotification({
        title: "Tarifa Actualizada",
        message: `La tarifa ${tariffName} de ${company} ha sido actualizada: ${changes}`,
        type: 'tariff_update',
        isGlobal: true,
        link: '/comparador'
    });
};

/**
 * Notifica una actualización general del sistema
 */
export const notifySystemUpdate = async (title: string, message: string, data?: any) => {
    await createNotification({
        title: title,
        message: message,
        type: 'system_update',
        isGlobal: true,
        data: data
    });
};

/**
 * Elimina una notificación por su ID
 */
export const deleteNotification = async (notificationId: string) => {
    try {
        await deleteDoc(doc(db, "notifications", notificationId));
        console.log("Notificación eliminada");
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
        throw error;
    }
};
