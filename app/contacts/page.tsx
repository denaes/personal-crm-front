"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Grid3x3,
    List,
    Mail,
    Phone,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useContacts, useSyncContacts, useUpdateContact, Contact } from "@/lib/hooks/use-contacts";
import { FavoriteStar } from "@/components/ui/favorite-star";

import { getInitials } from "@/lib/utils";
import { AppLayout } from "@/components/layout/app-layout";

type ViewMode = "grid" | "list";

export default function ContactsPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch real contacts from API
    const { data: contactsData, isLoading, error } = useContacts({
        search: debouncedSearch || undefined,
        sortBy: 'updatedAt',
        sortOrder: 'DESC'
    });
    const { data: recentContacts } = useContacts({ limit: 10, sortBy: 'updatedAt', sortOrder: 'DESC' });
    const { mutate: syncContacts, isPending: isSyncing } = useSyncContacts();
    const { mutate: updateContact } = useUpdateContact();

    const toggleFavorite = (e: React.MouseEvent, contact: Contact) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        updateContact({
            id: contact.id,
            data: { isFavorite: !contact.isFavorite } // CreateContactDto might not have isFavorite if it's not in the DTO? Check DTO.
        });
    };

    const rawContacts = contactsData?.data || (Array.isArray(contactsData) ? contactsData : []);
    const contacts = Array.isArray(rawContacts) ? rawContacts : [];

    // Valid contacts for display (backend handles filtering now)
    const displayedContacts = contacts;

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-6 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        {/* ... */}
                    </div>

                    {/* Search and View Controls - Always visible now */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search contacts... (or press Cmd+K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-2 glass-effect p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-secondary"
                                    }`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-colors ${viewMode === "list"
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-secondary"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="glass-effect p-6 rounded-2xl border border-red-500/50 bg-red-500/10 mb-6">
                            <p className="text-red-500">Failed to load contacts. Please try again.</p>
                        </div>
                    )}

                    {/* Content */}
                    {!isLoading && !error && (
                        <>
                            {/* Recently Updated Contacts Section - Only show when NOT searching */}
                            {!debouncedSearch && (recentContacts?.data || []).length > 0 && (
                                <div className="mb-8">
                                    <h2 className="font-display text-xl font-semibold mb-4">Recently Updated</h2>
                                    <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
                                        {(recentContacts?.data || [])
                                            .filter((c: Contact) => c.lastContactedAt || c.updatedAt)
                                            .slice(0, 10)
                                            .map((contact: Contact, index: number) => (
                                                <Link
                                                    href={`/contacts/${contact.id}`}
                                                    key={contact.id}
                                                    className="min-w-[280px]"
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="h-full glass-effect p-5 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer flex flex-col"
                                                    >
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0">
                                                                {contact.photoUrl ? (
                                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                                    <img src={contact.photoUrl} alt={contact.displayName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    getInitials(`${contact.givenName} ${contact.familyName}`)
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-semibold truncate">
                                                                    {contact.givenName} {contact.familyName}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Updated {new Date(contact.lastContactedAt || contact.updatedAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Tags */}
                                                        {contact.customTags && contact.customTags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-auto">
                                                                {contact.customTags.slice(0, 2).map((tag: string) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {contact.customTags.length > 2 && (
                                                                    <span className="px-2 py-0.5 text-[10px] bg-secondary text-muted-foreground rounded-full">
                                                                        +{contact.customTags.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Main Contacts List */}
                            {contacts.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-display text-xl font-semibold">
                                            {debouncedSearch ? "Search Results" : "All Contacts"}
                                        </h2>
                                    </div>

                                    {viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {displayedContacts.map((contact: Contact, index: number) => (
                                                <Link
                                                    href={`/contacts/${contact.id}`}
                                                    key={contact.id}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="h-full glass-effect p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer flex flex-col"
                                                    >
                                                        {/* Avatar */}
                                                        <div className="flex justify-center mb-4">
                                                            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                                {contact.photoUrl ? (
                                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                                    <img src={contact.photoUrl} alt={contact.displayName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    getInitials(`${contact.givenName} ${contact.familyName}`)
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Name */}
                                                        <h3 className="text-center font-semibold text-lg mb-1">
                                                            {contact.givenName} {contact.familyName}
                                                        </h3>
                                                        <button
                                                            onClick={(e) => toggleFavorite(e, contact)}
                                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full"
                                                        >
                                                            <FavoriteStar
                                                                isFavorite={contact.isFavorite}
                                                                className="w-4 h-4"
                                                            />
                                                        </button>

                                                        {/* Contact Info */}
                                                        <div className="space-y-2 mb-4 flex-1">
                                                            {contact.emailAddresses && contact.emailAddresses.length > 0 && (
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <Mail className="w-4 h-4" />
                                                                    <span className="truncate">{contact.emailAddresses[0]}</span>
                                                                </div>
                                                            )}
                                                            {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <Phone className="w-4 h-4" />
                                                                    <span>{contact.phoneNumbers[0]}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Tags */}
                                                        {contact.customTags && contact.customTags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                                                {contact.customTags.map((tag: string) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Priority Indicator */}
                                                        <div className="mt-auto pt-4 border-t border-border">
                                                            <div className="flex items-center justify-center gap-2 text-xs">
                                                                <div
                                                                    className={`w-2 h-2 rounded-full ${contact.priority === "high"
                                                                        ? "bg-red-500"
                                                                        : contact.priority === "medium"
                                                                            ? "bg-yellow-500"
                                                                            : "bg-green-500"
                                                                        }`}
                                                                />
                                                                <span className="text-muted-foreground capitalize">
                                                                    {contact.priority} priority
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass-effect rounded-2xl border border-border overflow-hidden">
                                            <div className="divide-y divide-border">
                                                {displayedContacts.map((contact: Contact, index: number) => (
                                                    <Link href={`/contacts/${contact.id}`} key={contact.id}>
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.03 }}
                                                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer group relative"
                                                        >
                                                            {/* Avatar */}
                                                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                                {contact.photoUrl ? (
                                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                                    <img src={contact.photoUrl} alt={contact.displayName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    getInitials(`${contact.givenName} ${contact.familyName}`)
                                                                )}
                                                            </div>

                                                            {/* Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold truncate">
                                                                    {contact.givenName} {contact.familyName}
                                                                </h3>
                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                                    {contact.emailAddresses && contact.emailAddresses[0] && (
                                                                        <span className="truncate">{contact.emailAddresses[0]}</span>
                                                                    )}
                                                                    {contact.phoneNumbers && contact.phoneNumbers[0] && (
                                                                        <span>{contact.phoneNumbers[0]}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Tags */}
                                                            <div className="flex gap-2">
                                                                {contact.customTags && contact.customTags.map((tag: string) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            <button
                                                                onClick={(e) => toggleFavorite(e, contact)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-full ml-4"
                                                            >
                                                                <FavoriteStar
                                                                    isFavorite={contact.isFavorite}
                                                                    className="w-4 h-4"
                                                                />
                                                            </button>

                                                            {/* Priority */}
                                                            <div
                                                                className={`w-3 h-3 rounded-full ${contact.priority === "high"
                                                                    ? "bg-red-500"
                                                                    : contact.priority === "medium"
                                                                        ? "bg-yellow-500"
                                                                        : "bg-green-500"
                                                                    }`}
                                                            />
                                                        </motion.div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Empty State */
                                <div className="glass-effect p-12 rounded-2xl border border-border text-center flex flex-col items-center">
                                    <p className="text-muted-foreground mb-4">
                                        {debouncedSearch
                                            ? `No contacts found matching "${debouncedSearch}"`
                                            : "No contacts found. Sync your Google contacts to get started!"
                                        }
                                    </p>
                                    {!debouncedSearch && (
                                        <button
                                            onClick={() => syncContacts()}
                                            disabled={isSyncing}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                                            {isSyncing ? "Syncing Google Contacts..." : "Sync Google Contacts"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout >
    );
}
