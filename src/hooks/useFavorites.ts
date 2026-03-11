"use client";

import { useState, useEffect } from "react";
import { getDb } from "@/lib/firebase";
import {
    doc,
    onSnapshot,
    setDoc,
    getDoc,
    arrayUnion,
    arrayRemove,
    Firestore
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        let unsubscribe: (() => void) | undefined;

        const setupFavorites = async () => {
            try {
                const db = await getDb();
                const userDocRef = doc(db, "users", user.uid);

                const docSnap = await getDoc(userDocRef);
                if (!docSnap.exists()) {
                    await setDoc(userDocRef, { favorites: [], email: user.email }, { merge: true });
                }

                unsubscribe = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setFavorites(doc.data().favorites || []);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Firestore favorite listener error:", error);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Error setting up favorites:", error);
                setLoading(false);
            }
        };

        setupFavorites();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const toggleFavorite = async (tariffId: string) => {
        if (!user) return false;

        try {
            const db = await getDb();
            const userDocRef = doc(db, "users", user.uid);
            const isFavorite = favorites.includes(tariffId);

            await setDoc(userDocRef, {
                favorites: isFavorite ? arrayRemove(tariffId) : arrayUnion(tariffId),
                email: user.email,
                lastUpdate: new Date()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error("Error toggling favorite:", error);
            return false;
        }
    };

    return { favorites, toggleFavorite, loading };
}
