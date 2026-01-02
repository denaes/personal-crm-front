"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getAuthToken } from "@/lib/api-config";
import { UsersService } from "@/lib/api";

/**
 * Hook to fetch and manage current user state
 */
export function useCurrentUser() {
    const { user, isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = getAuthToken();
            const publicRoutes = ['/', '/login', '/privacy', '/terms', '/features'];
            const isProtectedRoute = !publicRoutes.includes(pathname);

            if (!token) {
                setUser(null);
                setLoading(false);
                if (isProtectedRoute) {
                    router.push('/');
                }
                return;
            }

            try {
                setLoading(true);
                // Fetch user profile from backend
                const profile = await UsersService.usersControllerGetCurrentUser();
                setUser(profile as any);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setUser(null);
                if (isProtectedRoute) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [setUser, setLoading, pathname, router]);

    return {
        user,
        isAuthenticated,
        isLoading,
    };
}
