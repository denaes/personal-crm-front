"use client";

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
    StickyNote
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface InteractionsTableProps {
    interactions: any[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'call': return <Phone className="w-4 h-4 text-blue-500" />;
        case 'email': return <Mail className="w-4 h-4 text-green-500" />;
        case 'meeting': return <Users className="w-4 h-4 text-purple-500" />;
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

export function InteractionsTable({ interactions, onDelete, onEdit }: InteractionsTableProps) {
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
        <div className="rounded-md border bg-card">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                        <th className="h-10 px-4 w-[180px]">Date</th>
                        <th className="h-10 px-4 w-[120px]">Type</th>
                        <th className="h-10 px-4 w-[250px]">Contact</th>
                        <th className="h-10 px-4">Content</th>
                        <th className="h-10 px-4 w-[100px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {interactions.map((interaction) => (
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
                            <td className="p-4">
                                {interaction.contact ? (
                                    <Link
                                        href={`/contacts/${interaction.contact.id}`}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                            {interaction.contact.photoUrl ? (
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
                            <td className="p-4 max-w-[400px]">
                                <p className="truncate text-muted-foreground" title={interaction.content || interaction.notes}>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
