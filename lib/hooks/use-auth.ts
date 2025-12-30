"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getAuthToken } from "@/lib/api-config";
import { UsersService } from "@/lib/api";

/**
 * Hook to fetch and manage current user state
 */
export function useCurrentUser() {
    const { user, isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const fetchUser = async () => {
            const token = getAuthToken();

            if (!token) {
                setUser(null);
                setLoading(false);
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
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [setUser, setLoading]);

    return {
        user,
        isAuthenticated,
        isLoading,
    };
}
