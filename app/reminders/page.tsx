"use client";

import { useReminders, useDeleteReminder } from "@/lib/hooks/use-reminders";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Pencil, Trash, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemindersPage() {
    const router = useRouter();
    const [showCompleted, setShowCompleted] = useState(false);

    // Fetch active reminders
    const { data: activeReminders, isLoading: activeLoading } = useReminders(true);
    // Fetch inactive (completed/past) reminders if requested
    const { data: pastReminders, isLoading: pastLoading } = useReminders(false);

    const { mutate: deleteReminder } = useDeleteReminder();

    const displayedReminders = showCompleted ? pastReminders : activeReminders;
    const isLoading = showCompleted ? pastLoading : activeLoading;

    const list = Array.isArray(displayedReminders) ? displayedReminders : [];

    // Sort by due date (Active: ascending, Past: descending)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedReminders = [...list].sort((a: any, b: any) => {
        const dateA = new Date(a.scheduledFor || a.createdAt).getTime();
        const dateB = new Date(b.scheduledFor || b.createdAt).getTime();
        return showCompleted ? dateB - dateA : dateA - dateB;
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this reminder?")) {
            deleteReminder(id);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-display text-3xl font-bold mb-2">Reminders</h1>
                            <p className="text-muted-foreground">Manage your follow-ups and tasks</p>
                        </div>
                        <Link href="/reminders/new">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Reminder
                            </Button>
                        </Link>
                    </div>

                    {/* Tabs / Filter */}
                    <div className="flex gap-4 mb-6 border-b border-border pb-1">
                        <button
                            onClick={() => setShowCompleted(false)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${!showCompleted ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setShowCompleted(true)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${showCompleted ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        >
                            Completed / Past
                        </button>
                    </div>

                    <div className="glass-effect rounded-2xl border border-border overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : sortedReminders.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No active reminders</h3>
                                <p className="text-muted-foreground mb-6">You&apos;re all caught up!</p>
                                <Link href="/reminders/new">
                                    <Button variant="outline">Add Reminder</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {sortedReminders.map((reminder: any) => (
                                    <div key={reminder.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4 group">
                                        <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary">
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium">
                                                    {reminder.title || reminder.message}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(reminder.scheduledFor || reminder.createdAt), 'PPP p')}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                For: <span className="font-medium text-foreground">{reminder.contact?.displayName}</span>
                                            </p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/reminders/${reminder.id}/edit`)}
                                            >
                                                <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(reminder.id)}
                                            >
                                                <Trash className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
