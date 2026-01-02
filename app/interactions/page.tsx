"use client";

import { useInteractions, useDeleteInteraction } from "@/lib/hooks/use-interactions";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { InteractionsTable } from "@/components/interactions/interactions-table";

export default function InteractionsPage() {
    const router = useRouter();
    const { data: interactions, isLoading } = useInteractions();
    console.log('Interactions Page Data:', interactions);
    const { mutate: deleteInteraction } = useDeleteInteraction();

    const sortedInteractions = Array.isArray(interactions)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? [...interactions].sort((a: any, b: any) =>
            new Date(b.occurredAt || b.createdAt).getTime() - new Date(a.occurredAt || a.createdAt).getTime()
        )
        : [];

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this interaction?")) {
            deleteInteraction(id);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-display text-3xl font-bold mb-2">Interactions</h1>
                            <p className="text-muted-foreground">History of your communications</p>
                        </div>
                        <Link href="/interactions/new">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Log Interaction
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <InteractionsTable
                                interactions={sortedInteractions}
                                onDelete={handleDelete}
                                onEdit={(id) => router.push(`/interactions/${id}/edit`)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
