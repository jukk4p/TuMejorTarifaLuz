"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import AuthModal from "./AuthModal";

function AuthModalContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");

    useEffect(() => {
        const authParam = searchParams.get("auth");
        if (authParam === "login" || authParam === "register") {
            setMode(authParam as "login" | "register");
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsOpen(false);
        // Remove the auth param from URL without refreshing
        const params = new URLSearchParams(searchParams.toString());
        params.delete("auth");
        const newPath = params.toString() ? `?${params.toString()}` : "/";
        router.push(newPath, { scroll: false });
    };

    return (
        <AuthModal 
            isOpen={isOpen} 
            onClose={handleClose} 
            initialMode={mode} 
        />
    );
}

export default function AuthModalHandler() {
    return (
        <Suspense fallback={null}>
            <AuthModalContent />
        </Suspense>
    );
}
