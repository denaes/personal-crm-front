"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken } from "@/lib/api-config";
import { Loader2 } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refresh");

        if (token) {
            // Store tokens
            setAuthToken(token);
            if (refreshToken) {
                localStorage.setItem("refresh_token", refreshToken);
            }

            // Redirect to dashboard
            router.push("/dashboard");
        } else {
            // No token, redirect to login
            router.push("/login");
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Completing sign in...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
