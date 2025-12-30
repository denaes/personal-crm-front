"use client";

import { motion } from "framer-motion";
import { Users, Activity, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { useContacts } from "@/lib/hooks/use-contacts";
import { useInteractions, useDeleteInteraction } from "@/lib/hooks/use-interactions";
import { useReminders } from "@/lib/hooks/use-reminders";
import { getInitials } from "@/lib/utils";
import { InteractionsTable } from "@/components/interactions/interactions-table";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    // Fetch real data
    const { data: contactsData } = useContacts({ limit: 5, sortBy: 'updatedAt', sortOrder: 'DESC' }); // Get recent 5
    // console.log('Dashboard contactsData:', contactsData);
    const { data: interactions } = useInteractions();
    const { mutate: deleteInteraction } = useDeleteInteraction();
    const { data: reminders } = useReminders(true); // Active only

    // Robust extraction
    const rawContacts = contactsData?.data;
    const contacts = Array.isArray(rawContacts) ? rawContacts : [];
    const totalContacts = contactsData?.total || 0;
    const totalInteractions = Array.isArray(interactions) ? interactions.length : 0;
    const activeReminders = Array.isArray(reminders) ? reminders.length : 0;

    const handleDeleteInteraction = (id: string) => {
        if (window.confirm("Are you sure you want to delete this interaction?")) {
            deleteInteraction(id);
        }
    };

    // Filter reminders for today
    const today = new Date().toISOString().split('T')[0];
    const todaysReminders = Array.isArray(reminders)
        ? reminders.filter((r: any) => r.dueDate?.startsWith(today))
        : [];

    const stats = [
        {
            title: "Total Contacts",
            value: totalContacts.toString(),
            change: "+12%", // TODO: implementation of history diff
            icon: Users,
            color: "from-purple-500 to-blue-500",
        },
        {
            title: "Total Interactions",
            value: totalInteractions.toString(),
            change: "+5%", // TODO: implementation of history diff
            icon: Activity,
            color: "from-cyan-500 to-teal-500",
        },
        {
            title: "Active Reminders",
            value: activeReminders.toString(),
            change: `${todaysReminders.length} today`,
            icon: Calendar,
            color: "from-pink-500 to-rose-500",
        },
        {
            title: "Engagement Score",
            value: "87%", // TODO: implementation of AI score
            change: "+3%",
            icon: TrendingUp,
            color: "from-amber-500 to-orange-500",
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-6 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back! Here&apos;s what&apos;s happening.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-effect p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xs text-success font-medium">
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold font-display">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Interactions - Span 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 glass-effect p-6 rounded-2xl border border-border"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-xl font-semibold">Recent Activity</h2>
                                <Link
                                    href="/interactions"
                                    className="text-sm text-primary hover:underline"
                                >
                                    View all
                                </Link>
                            </div>
                            <InteractionsTable
                                interactions={(Array.isArray(interactions) ? interactions : []).slice(0, 5)}
                                onDelete={handleDeleteInteraction}
                                onEdit={(id) => router.push(`/interactions/${id}/edit`)}
                            />
                        </motion.div>

                        {/* Today's Reminders - Span 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-effect p-6 rounded-2xl border border-border"
                        >
                            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                Today&apos;s Reminders
                            </h2>
                            <div className="space-y-3">
                                {todaysReminders.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No reminders for today.</p>
                                ) : (
                                    todaysReminders.map((reminder: any, i: number) => (
                                        <div
                                            key={reminder.id || i}
                                            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            <p className="text-sm font-medium">{reminder.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Contacts - Span 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="lg:col-span-2 glass-effect p-6 rounded-2xl border border-border"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-xl font-semibold">Recent Contacts</h2>
                                <Link
                                    href="/contacts"
                                    className="text-sm text-primary hover:underline"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {contacts.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">No contacts yet.</p>
                                ) : (
                                    contacts.map((contact: any, i: number) => (
                                        <Link
                                            key={contact.id || i}
                                            href={`/contacts/${contact.id}`}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold overflow-hidden">
                                                {contact.photoUrl ? (
                                                    <img src={contact.photoUrl} alt={contact.displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    getInitials(contact.displayName || `${contact.givenName} ${contact.familyName}`)
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium group-hover:text-primary transition-colors">
                                                    {contact.displayName || `${contact.givenName} ${contact.familyName}`}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {contact.emailAddresses?.[0] || 'No email'}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* AI Insights - Span 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="glass-effect p-6 rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 to-cyan-500/10"
                        >
                            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                AI Insights
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="w-1 bg-gradient-primary rounded-full shrink-0" />
                                    <p className="text-xs text-muted-foreground">
                                        You haven&apos;t contacted 5 high-priority contacts in over 2 weeks
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1 bg-gradient-accent rounded-full shrink-0" />
                                    <p className="text-xs text-muted-foreground">
                                        Best time to reach out to contacts: Tuesday mornings
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
