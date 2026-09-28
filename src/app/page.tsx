"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
        } else {
            router.replace("/login");
        }
    }, [isAuthenticated, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );
}
