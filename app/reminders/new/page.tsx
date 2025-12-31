"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { ReminderForm } from "@/components/forms/reminder-form";
import { Loader2 } from "lucide-react";

function ReminderContent() {
    const searchParams = useSearchParams();
    const contactId = searchParams?.get("contactId") || undefined;
    return <ReminderForm contactId={contactId} />;
}

export default function NewReminderPage() {
    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <h1 className="font-display text-2xl font-bold mb-6">Create Reminder</h1>
                    <div className="glass-effect p-8 rounded-2xl border border-border">
                        <Suspense fallback={
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        }>
                            <ReminderContent />
                        </Suspense>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
