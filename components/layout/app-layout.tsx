"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { useCurrentUser } from "@/lib/hooks/use-auth";

import { Footer } from "@/components/layout/footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Initialize auth state
    useCurrentUser();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar onSearchOpen={() => setCommandPaletteOpen(true)} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
            />
        </div>
    );
}
