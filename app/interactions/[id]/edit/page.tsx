"use client";

import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { InteractionForm } from "@/components/forms/interaction-form";
import { useInteraction } from "@/lib/hooks/use-interactions";

export default function EditInteractionPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data: interaction, isLoading } = useInteraction(id);

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        );
    }

    if (!interaction) {
        return <AppLayout><div>Interaction not found</div></AppLayout>;
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <h1 className="font-display text-2xl font-bold mb-6">Edit Interaction</h1>
                    <div className="glass-effect p-8 rounded-2xl border border-border">
                        <InteractionForm initialData={interaction} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
