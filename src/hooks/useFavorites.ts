"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    doc,
    onSnapshot,
    updateDoc,
    setDoc,
    getDoc,
    arrayUnion,
    arrayRemove
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

        const userDocRef = doc(db, "users", user.uid);

        // First, check if the document exists to avoid unnecessary snapshot error loops if rules are very strict
        const checkDoc = async () => {
            try {
                const docSnap = await getDoc(userDocRef);
                if (!docSnap.exists()) {
                    // Initialize if missing - this is safe here because it's triggered by the hook mounting
                    await setDoc(userDocRef, { favorites: [], email: user.email }, { merge: true });
                }

                // Once we're sure it exists (or we tried to create it), start the real-time listener
                const unsubscribe = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setFavorites(doc.data().favorites || []);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Firestore favorite listener error:", error);
                    // Silently fail or use local state if permissions fail
                    setLoading(false);
                });

                return unsubscribe;
            } catch (error) {
                console.error("Error ensuring user profile existence:", error);
                setLoading(false);
                return () => { };
            }
        };

        const setupPromise = checkDoc();

        return () => {
            setupPromise.then(unsubscribe => unsubscribe());
        };
    }, [user]);

    const toggleFavorite = async (tariffId: string) => {
        if (!user) return false;

        const userDocRef = doc(db, "users", user.uid);
        const isFavorite = favorites.includes(tariffId);

        try {
            // Using setDoc with merge instead of updateDoc to create the profile if it doesn't exist
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
