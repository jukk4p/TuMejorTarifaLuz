import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tariff } from '@/lib/tariffs';
import tariffsData from '@/lib/data.json';

// We initially populate with data.json to avoid layout shift,
// but then synchronize with Firebase for real-time updates.
import { getTariffId } from '@/lib/tariffs';

// We initially populate with data.json to avoid layout shift,
// but then synchronize with Firebase for real-time updates.
export function useTariffs() {
    const defaultTariffs = (tariffsData as Tariff[]).map(t => ({
        ...t,
        id: getTariffId(t)
    }));
    const [tariffs, setTariffs] = useState<Tariff[]>(defaultTariffs);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "tariffs"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                return { ...doc.data(), id: doc.id } as Tariff;
            });
            if (data.length > 0) {
                setTariffs(data);
            }
            setLoading(false);
        }, (error) => {
            // Silently fail for guests or handle permission errors gracefully
            if (error.code !== "permission-denied") {
                console.error("Firebase fetch error:", error);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { tariffs, loading };
}
