'use client';

import { useEffect } from 'react';
import { initializeApi } from '@/lib/api-init';

export function ApiProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize API client on mount
        initializeApi();
    }, []);

    return <>{children}</>;
}
