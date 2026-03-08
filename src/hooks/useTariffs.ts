import { useState, useEffect } from 'react';
import { Tariff } from '@/lib/tariffs';
import tariffsData from '@/lib/data.json';
import { getTariffId } from '@/lib/tariffs';

export function useTariffs() {
    // Usamos exclusivamente los datos de data.json que el usuario actualiza manualmente
    const defaultTariffs = (tariffsData as Tariff[]).map(t => ({
        ...t,
        id: getTariffId(t)
    }));

    const [tariffs] = useState<Tariff[]>(defaultTariffs);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Ya no necesitamos sincronizar con Firestore para los precios
        // puesto que el usuario prefiere gestionarlos vía script manual + data.json
        setLoading(false);
    }, []);

    return { tariffs, loading };
}
