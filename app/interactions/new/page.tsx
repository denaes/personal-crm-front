"use client";

import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { InteractionForm } from "@/components/forms/interaction-form";

export default function NewInteractionPage() {
    const searchParams = useSearchParams();
    const contactId = searchParams?.get("contactId") || undefined;

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <h1 className="font-display text-2xl font-bold mb-6">Log Interaction</h1>
                    <div className="glass-effect p-8 rounded-2xl border border-border">
                        <InteractionForm contactId={contactId} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
