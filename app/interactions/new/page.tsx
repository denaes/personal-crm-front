"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { InteractionForm } from "@/components/forms/interaction-form";
import { Loader2 } from "lucide-react";

function InteractionContent() {
    const searchParams = useSearchParams();
    const contactId = searchParams?.get("contactId") || undefined;
    return <InteractionForm contactId={contactId} />;
}

export default function NewInteractionPage() {
    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <h1 className="font-display text-2xl font-bold mb-6">Log Interaction</h1>
                    <div className="glass-effect p-8 rounded-2xl border border-border">
                        <Suspense fallback={
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        }>
                            <InteractionContent />
                        </Suspense>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
