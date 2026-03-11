"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut,
    Auth
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const setupAuth = async () => {
            try {
                const auth = await getAuthInstance();
                unsubscribe = onAuthStateChanged(auth, (user) => {
                    setUser(user);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Failed to initialize auth:", error);
                setLoading(false);
            }
        };

        setupAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            const auth = await getAuthInstance();
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
