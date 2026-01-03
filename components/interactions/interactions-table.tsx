"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
    MessageSquare,
    Phone,
    Mail,
    Users,
    Gift,
    Calendar,
    Pencil,
    Trash,
    StickyNote,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";


interface InteractionsTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interactions: any[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    showContactColumn?: boolean;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'call': return <Phone className="w-4 h-4 text-blue-500" />;
        case 'email': return <Mail className="w-4 h-4 text-green-500" />;
        case 'meeting': return <Calendar className="w-4 h-4 text-purple-500" />;
        case 'note': return <StickyNote className="w-4 h-4 text-yellow-500" />;
        case 'gift': return <Gift className="w-4 h-4 text-pink-500" />;
        case 'event': return <Calendar className="w-4 h-4 text-orange-500" />;
        default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
};

const getInitials = (name: string) => {
    return (name || "")
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

type SortField = 'date' | 'type' | 'contact';
type SortDirection = 'asc' | 'desc';

export function InteractionsTable({ interactions, onDelete, onEdit, showContactColumn = true }: InteractionsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const filteredAndSortedInteractions = useMemo(() => {
        let result = [...interactions];

        // Filter by type
        if (typeFilter !== "all") {
            result = result.filter(i => i.type === typeFilter);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(i =>
                (i.content || "").toLowerCase().includes(query) ||
                (showContactColumn && (i.contact?.displayName || "").toLowerCase().includes(query)) ||
                (i.type || "").toLowerCase().includes(query)
            );
        }

        // Sorting
        result.sort((a, b) => {
            let valA, valB;

            switch (sortField) {
                case 'date':
                    valA = new Date(a.occurredAt || a.createdAt).getTime();
                    valB = new Date(b.occurredAt || b.createdAt).getTime();
                    break;
                case 'type':
                    valA = a.type || "";
                    valB = b.type || "";
                    break;
                case 'contact':
                    if (showContactColumn) {
                        valA = a.contact?.displayName || "";
                        valB = b.contact?.displayName || "";
                    } else {
                        return 0;
                    }
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [interactions, searchQuery, typeFilter, sortField, sortDirection, showContactColumn]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 text-muted-foreground/50" />;
        return sortDirection === 'asc'
            ? <ArrowUp className="w-4 h-4 ml-1 text-primary" />
            : <ArrowDown className="w-4 h-4 ml-1 text-primary" />;
    };

    if (!interactions.length) {
        return (
            <div className="p-12 text-center border rounded-lg bg-muted/10">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No interactions found</h3>
                <p className="text-muted-foreground">Get started by logging your first interaction.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search interactions..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={typeFilter === 'all'} onCheckedChange={() => setTypeFilter('all')}>
                                All Types
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={typeFilter === 'call'} onCheckedChange={() => setTypeFilter('call')}>
                                Calls
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={typeFilter === 'email'} onCheckedChange={() => setTypeFilter('email')}>
                                Emails
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={typeFilter === 'meeting'} onCheckedChange={() => setTypeFilter('meeting')}>
                                Meetings
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={typeFilter === 'note'} onCheckedChange={() => setTypeFilter('note')}>
                                Notes
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="h-10 px-4 w-[180px] cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('date')}>
                                <div className="flex items-center">
                                    Date
                                    <SortIcon field="date" />
                                </div>
                            </th>
                            <th className="h-10 px-4 w-[120px] cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('type')}>
                                <div className="flex items-center">
                                    Type
                                    <SortIcon field="type" />
                                </div>
                            </th>
                            {showContactColumn && (
                                <th className="h-10 px-4 w-[250px] cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => handleSort('contact')}>
                                    <div className="flex items-center">
                                        Contact
                                        <SortIcon field="contact" />
                                    </div>
                                </th>
                            )}
                            <th className="h-10 px-4">Content</th>
                            <th className="h-10 px-4 w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredAndSortedInteractions.length === 0 ? (
                            <tr>
                                <td colSpan={showContactColumn ? 5 : 4} className="p-8 text-center text-muted-foreground">
                                    No interactions match your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedInteractions.map((interaction) => (
                                <tr key={interaction.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-4 whitespace-nowrap text-muted-foreground">
                                        {format(new Date(interaction.occurredAt || interaction.createdAt), 'MMM d, yyyy h:mm a')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-background rounded-md border shadow-sm">
                                                {getTypeIcon(interaction.type)}
                                            </div>
                                            <span className="capitalize">{interaction.type}</span>
                                        </div>
                                    </td>
                                    {showContactColumn && (
                                        <td className="p-4">
                                            {interaction.contact ? (
                                                <Link
                                                    href={`/contacts/${interaction.contact.id}`}
                                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                        {interaction.contact.photoUrl ? (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img src={interaction.contact.photoUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                {getInitials(interaction.contact.displayName)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="font-medium truncate max-w-[180px]">
                                                        {interaction.contact.displayName}
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="text-muted-foreground italic flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <span className="text-xs font-medium text-muted-foreground">?</span>
                                                    </div>
                                                    Unknown
                                                </div>
                                            )}
                                        </td>
                                    )}
                                    <td className="p-4 max-w-[400px]">
                                        <p className="whitespace-pre-wrap break-words text-muted-foreground" title={interaction.content || interaction.notes}>
                                            {interaction.content || interaction.notes || "No content"}
                                        </p>
                                    </td>
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(interaction.id)}
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(interaction.id)}
                                            title="Delete"
                                        >
                                            <Trash className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Showing {filteredAndSortedInteractions.length} of {interactions.length} interactions
            </div>
        </div>
    );
}
