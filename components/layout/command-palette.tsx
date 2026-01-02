"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Search, Users, MessageSquare, Bell, Hash, ArrowRight } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useContacts } from "@/lib/hooks/use-contacts";

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Command {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    category: "navigation" | "contacts" | "actions" | "tags";
    initials?: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch contacts (recent if empty search, matching if searching)
    const { data: contactsData } = useContacts({
        search: debouncedSearch || undefined,
        limit: 5,
        page: 1
    });

    // Safely extract contacts list handling both Search (Array) and List (Paginated Object) responses
    const contactsList = Array.isArray(contactsData)
        ? contactsData
        : (contactsData && typeof contactsData === 'object' && 'data' in contactsData && Array.isArray(contactsData.data)
            ? contactsData.data
            : []);

    // Static commands
    const staticCommands: Command[] = useMemo(
        () => [
            // Navigation
            {
                id: "nav-dashboard",
                title: "Go to Dashboard",
                icon: ArrowRight,
                category: "navigation",
                action: () => router.push("/dashboard"),
            },
            {
                id: "nav-contacts",
                title: "Go to Contacts",
                icon: Users,
                category: "navigation",
                action: () => router.push("/contacts"),
            },
            {
                id: "nav-interactions",
                title: "Go to Interactions",
                icon: MessageSquare,
                category: "navigation",
                action: () => router.push("/interactions"),
            },
            {
                id: "nav-reminders",
                title: "Go to Reminders",
                icon: Bell,
                category: "navigation",
                action: () => router.push("/reminders"),
            },
            // Quick Actions
            {
                id: "action-add-contact",
                title: "Add New Contact",
                icon: Users,
                category: "actions",
                action: () => router.push("/contacts/new"),
            },
            {
                id: "action-log-interaction",
                title: "Log Interaction",
                icon: MessageSquare,
                category: "actions",
                action: () => router.push("/interactions/new"),
            },
            {
                id: "action-create-reminder",
                title: "Create Reminder",
                icon: Bell,
                category: "actions",
                action: () => router.push("/reminders/new"),
            },
            // Tags
            {
                id: "tag-friends",
                title: "View Friends",
                subtitle: "Filter by tag: friends",
                icon: Hash,
                category: "tags",
                action: () => router.push("/contacts?tag=friends"),
            },
            {
                id: "tag-work",
                title: "View Work Contacts",
                subtitle: "Filter by tag: work",
                icon: Hash,
                category: "tags",
                action: () => router.push("/contacts?tag=work"),
            },
        ],
        [router]
    );

    // Combine commands
    const filteredCommands = useMemo(() => {
        let commands = [...staticCommands];
        const query = search.toLowerCase();

        // Convert contacts to commands
        const contactCommands: Command[] = contactsList
            // Filter locally if awaiting debounce (optional, but smoother UI)
            // .filter((c: any) => !search || (c.displayName || "").toLowerCase().includes(query))
            .slice(0, 5)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((contact: any) => ({
                id: `contact-${contact.id}`,
                title: contact.displayName || `${contact.givenName} ${contact.familyName}`,
                subtitle: contact.emailAddresses?.[0] || extractJob(contact) || "Contact",
                icon: Users,
                category: "contacts",
                initials: getInitials(contact.displayName || `${contact.givenName} ${contact.familyName}`),
                action: () => router.push(`/contacts/${contact.id}`),
            }));

        // Filter static commands
        if (search) {
            commands = commands.filter(
                (cmd) =>
                    cmd.title.toLowerCase().includes(query) ||
                    cmd.subtitle?.toLowerCase().includes(query) ||
                    cmd.category.toLowerCase().includes(query)
            );
        }

        // Add contacts (always show if present, or prioritized?)
        // If searching, show matched contacts FIRST if they match well?
        // Current logic: Navigation/Actions/Tags first, then Contacts?
        // Or Contacts mixed in?
        // I will append Contacts.

        // If we have search results, they are highly relevant.
        // Let's put contacts at the top if searching?
        // For now, I'll put them in their category group.

        return [...commands, ...contactCommands];
    }, [search, staticCommands, contactsList, router]);

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setSearch("");
            setSelectedIndex(0);
        }
    }, [open]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            // Fix for arrow keys scrolling page
            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case "ArrowDown":
                    setSelectedIndex((prev) =>
                        prev < filteredCommands.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].action();
                        onOpenChange(false);
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, filteredCommands, selectedIndex, onOpenChange]);

    const categoryLabels = {
        contacts: "Contacts",
        navigation: "Navigation",
        actions: "Quick Actions",
        tags: "Tags",
    };

    // Group commands by category (Custom order: Contacts -> Navigation -> Actions -> Tags)
    const groupedCommands = useMemo(() => {
        const groups: Record<string, Command[]> = {};
        const categoriesOrder = ["contacts", "navigation", "actions", "tags"];

        // Initialize groups
        categoriesOrder.forEach(cat => groups[cat] = []);

        filteredCommands.forEach((cmd) => {
            if (!groups[cmd.category]) {
                groups[cmd.category] = [];
            }
            groups[cmd.category].push(cmd);
        });

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) delete groups[key];
        });

        return groups;
    }, [filteredCommands]);

    // Handle initial selection when list changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]); // Reset when search changes

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
                <DialogTitle className="sr-only">Command Palette</DialogTitle>
                {/* Search Input */}
                <div className="flex items-center border-b border-border px-4">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <input
                        type="text"
                        placeholder="Search contacts, tags, or navigate..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 py-4 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                        autoFocus
                    />
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        ESC
                    </kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            No results found for &quot;{search}&quot;
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedCommands).map(([category, cmds], groupIndex) => {
                                // Calculate offset based on previous groups
                                let offset = 0;
                                const keys = Object.keys(groupedCommands);
                                for (let i = 0; i < groupIndex; i++) {
                                    offset += groupedCommands[keys[i]].length;
                                }

                                return (
                                    <div key={category}>
                                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {categoryLabels[category as keyof typeof categoryLabels]}
                                        </div>
                                        <div className="space-y-1">
                                            {cmds.map((cmd, index) => {
                                                const absoluteIndex = offset + index;
                                                const isSelected = absoluteIndex === selectedIndex;

                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={() => {
                                                            cmd.action();
                                                            onOpenChange(false);
                                                        }}
                                                        onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                            isSelected
                                                                ? "bg-primary text-primary-foreground"
                                                                : "hover:bg-muted"
                                                        )}
                                                    >
                                                        {cmd.category === 'contacts' && cmd.initials ? (
                                                            <div className={cn(
                                                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                                                isSelected ? "bg-primary-foreground text-primary" : "bg-gradient-primary text-white"
                                                            )}>
                                                                {cmd.initials}
                                                            </div>
                                                        ) : (
                                                            <cmd.icon className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium truncate">
                                                                {cmd.title}
                                                            </div>
                                                            {cmd.subtitle && (
                                                                <div className={cn("text-xs truncate", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                                                    {cmd.subtitle}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isSelected && (
                                                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Hint */}
                <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Navigate with ↑↓ arrows</span>
                    <span>Press Enter to select</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractJob(contact: any): string | undefined {
    return contact.organizations?.[0]?.title;
}
