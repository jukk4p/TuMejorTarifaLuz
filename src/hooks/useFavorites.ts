"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
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

        const userDocRef = doc(db, "users", user.uid);
        
        // Ensure user doc exists
        getDoc(userDocRef).then(snap => {
            if (!snap.exists()) {
                setDoc(userDocRef, { favorites: [], email: user.email }, { merge: true });
            }
        });

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setFavorites(docSnap.data().favorites || []);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firestore favorite listener error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleFavorite = async (tariffId: string) => {
        if (!user) return false;

        try {
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
