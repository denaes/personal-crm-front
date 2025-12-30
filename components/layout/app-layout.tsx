"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { useCurrentUser } from "@/lib/hooks/use-auth";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Initialize auth state
    useCurrentUser();

    return (
        <>
            <Navbar onSearchOpen={() => setCommandPaletteOpen(true)} />
            {children}
            <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
            />
        </>
    );
}
