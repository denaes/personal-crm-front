"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import { Loader2 } from "lucide-react";

/**
 * HOC to protect routes that require authentication
 */
export function withAuth<P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> {
    return function ProtectedRoute(props: P) {
        const router = useRouter();
        const { isAuthenticated, isLoading } = useCurrentUser();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push("/login");
            }
        }, [isAuthenticated, isLoading, router]);

        if (isLoading) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            );
        }

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };
}
