"use client";

import { useParams, useRouter } from "next/navigation";
import { useContact } from "@/lib/hooks/use-contacts";
import { useInteractionsByContact, useCreateInteraction, useDeleteInteraction } from "@/lib/hooks/use-interactions";
import { useRemindersByContact, useCreateReminder, useDeleteReminder } from "@/lib/hooks/use-reminders";
import { AppLayout } from "@/components/layout/app-layout";
import { getInitials, cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Mail,
    Phone,
    Calendar,
    MapPin,
    Tag,
    MessageSquare,
    Bell,
    Plus,
    Clock,
    ArrowLeft,
    Trash,
    Pencil,
    Check
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { data: contact, isLoading: contactLoading } = useContact(id);
    const { data: interactions, isLoading: interactionsLoading } = useInteractionsByContact(id);
    const { data: reminders, isLoading: remindersLoading } = useRemindersByContact(id);
    const { mutate: deleteInteraction } = useDeleteInteraction();
    const { mutate: deleteReminder } = useDeleteReminder();

    if (contactLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        );
    }

    if (!contact) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-bold mb-4">Contact not found</h2>
                    <Link href="/contacts" className="text-primary hover:underline">
                        Return to Contacts
                    </Link>
                </div>
            </AppLayout>
        );
    }

    // Sort interactions by date (descending)
    const sortedInteractions = Array.isArray(interactions)
        ? [...interactions].sort((a: any, b: any) =>
            new Date(b.occurredAt || b.createdAt).getTime() - new Date(a.occurredAt || a.createdAt).getTime()
        )
        : [];

    const handleDeleteInteraction = (interactionId: string) => {
        if (confirm("Delete this interaction?")) {
            deleteInteraction(interactionId);
        }
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-background pb-12">
                {/* Header / Banner */}
                <div className="bg-muted/30 border-b border-border">
                    <div className="container mx-auto px-6 py-8">
                        <Link
                            href="/contacts"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Contacts
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden"
                            >
                                {contact.photoUrl ? (
                                    <img src={contact.photoUrl} alt={contact.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(contact.displayName || `${contact.givenName} ${contact.familyName}`)
                                )}
                            </motion.div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-display text-4xl font-bold mb-2"
                                >
                                    {contact.displayName || `${contact.givenName} ${contact.familyName}`}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-wrap gap-4 text-muted-foreground"
                                >
                                    {contact.organizations?.[0]?.title && (
                                        <span className="flex items-center gap-2">
                                            {contact.organizations[0].title}
                                            {contact.organizations[0].name ? ` at ${contact.organizations[0].name}` : ''}
                                        </span>
                                    )}
                                </motion.div>

                                {/* Tags */}
                                {contact.customTags && contact.customTags.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex gap-2 mt-4"
                                    >
                                        {contact.customTags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Actions & Details */}
                        <div className="space-y-6">

                            {/* Embedded Quick Actions */}
                            <section className="glass-effect p-6 rounded-2xl border border-border">
                                <QuickActions contactId={id} />
                            </section>

                            {/* Contact Information */}
                            <section className="glass-effect p-6 rounded-2xl border border-border">
                                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                                    Details
                                </h2>
                                <div className="space-y-4">
                                    {contact.emailAddresses?.map((email: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                                            <Mail className="w-4 h-4" />
                                            <a href={`mailto:${email}`} className="hover:underline flex-1 truncate">{email}</a>
                                        </div>
                                    ))}
                                    {contact.phoneNumbers?.map((phone: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${phone}`} className="hover:underline flex-1 truncate">{phone}</a>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reminders List */}
                            <section className="glass-effect p-6 rounded-2xl border border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-primary" />
                                        Reminders
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {remindersLoading ? (
                                        <div className="animate-pulse h-20 bg-muted rounded-lg" />
                                    ) : !reminders || reminders.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No active reminders.</p>
                                    ) : (
                                        reminders.map((reminder: any) => (
                                            <div key={reminder.id} className="p-3 bg-muted/30 rounded-lg flex gap-3 group">
                                                <div className="mt-1">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{reminder.title || reminder.message}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(reminder.scheduledFor || reminder.createdAt), 'PPP p')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this reminder?')) {
                                                            deleteReminder(reminder.id);
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Timeline */}
                        <div className="lg:col-span-2">
                            <section className="glass-effect p-6 rounded-2xl border border-border min-h-[500px]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                                        <ActivityIcon className="w-5 h-5 text-primary" />
                                        Interaction Timeline
                                    </h2>
                                </div>

                                <div className="relative pl-8 border-l-2 border-muted space-y-8">
                                    {interactionsLoading ? (
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-24 bg-muted rounded-xl" />
                                            <div className="h-24 bg-muted rounded-xl" />
                                        </div>
                                    ) : !sortedInteractions || sortedInteractions.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground ml-[-32px]">
                                            <p>No interactions logged yet.</p>
                                            <p className="text-xs mt-1">Start tracking your relationship history!</p>
                                        </div>
                                    ) : (
                                        sortedInteractions.map((interaction: any, index: number) => (
                                            <motion.div
                                                key={interaction.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="relative group"
                                            >
                                                {/* Timeline Dot */}
                                                <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-background bg-primary" />

                                                <div className="bg-muted/30 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                                {interaction.type}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                • {format(new Date(interaction.occurredAt || interaction.createdAt), 'PPP')}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => router.push(`/interactions/${interaction.id}/edit`)}>
                                                                <Pencil className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteInteraction(interaction.id)}>
                                                                <Trash className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium whitespace-pre-wrap">{interaction.content || interaction.description || interaction.notes}</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function QuickActions({ contactId }: { contactId: string }) {
    const [tab, setTab] = useState<'interaction' | 'reminder'>('interaction');

    return (
        <div>
            <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
                <button
                    onClick={() => setTab('interaction')}
                    className={cn(
                        "flex-1 text-sm font-medium py-1.5 rounded-md transition-all",
                        tab === 'interaction' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Log Interaction
                </button>
                <button
                    onClick={() => setTab('reminder')}
                    className={cn(
                        "flex-1 text-sm font-medium py-1.5 rounded-md transition-all",
                        tab === 'reminder' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Add Reminder
                </button>
            </div>

            {tab === 'interaction' ? (
                <InlineInteractionForm contactId={contactId} />
            ) : (
                <InlineReminderForm contactId={contactId} />
            )}
        </div>
    )
}

function InlineInteractionForm({ contactId }: { contactId: string }) {
    const { mutate: createInteraction, isPending } = useCreateInteraction();
    const [type, setType] = useState('note');
    const [content, setContent] = useState('');
    const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16));

    const types = [
        { id: 'note', label: 'Note', icon: MessageSquare },
        { id: 'call', label: 'Call', icon: Phone },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'meeting', label: 'Meeting', icon: Calendar },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        createInteraction({
            contactId,
            type: type as any,
            content,
            occurredAt: new Date(occurredAt).toISOString(),
        }, {
            onSuccess: () => {
                setContent('');
                // Optional: toast
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {types.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors",
                            type === t.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        )}
                    >
                        <t.icon className="w-3 h-3" />
                        {t.label}
                    </button>
                ))}
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        handleSubmit(e);
                    }
                }}
                placeholder="What happened? (Cmd+Enter to save)"
                className="w-full h-24 rounded-lg bg-background border border-input p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                required
            />

            <div className="flex items-center justify-between gap-4">
                <input
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                    className="bg-transparent text-xs text-muted-foreground focus:outline-none"
                />
                <Button size="sm" type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Log'}
                </Button>
            </div>
        </form>
    );
}

function InlineReminderForm({ contactId }: { contactId: string }) {
    const { mutate: createReminder, isPending } = useCreateReminder();
    const [message, setMessage] = useState('');
    const [date, setDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message) return;

        createReminder({
            contactId,
            type: 'follow_up' as any,
            message,
            scheduledFor: new Date(date).toISOString(),
            isActive: true
        }, {
            onSuccess: () => {
                setMessage('');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        handleSubmit(e);
                    }
                }}
                placeholder="Remind me to... (Cmd+Enter to save)"
                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
            />

            <div className="flex items-center justify-between gap-4">
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-xs text-muted-foreground focus:outline-none"
                />
                <Button size="sm" type="submit" disabled={isPending}>
                    {isPending ? 'Save' : 'Set'}
                </Button>
            </div>
        </form>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
