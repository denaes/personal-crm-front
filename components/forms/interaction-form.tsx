"use client";

import { useForm } from "react-hook-form";
import { UpdateInteractionDto } from "@/lib/api";
import { useCreateInteraction, useUpdateInteraction } from "@/lib/hooks/use-interactions";
import { useContacts } from "@/lib/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Interaction Types from DTO
const INTERACTION_TYPES = [
    { value: 'note', label: 'Note' },
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'message', label: 'Message' },
    { value: 'gift', label: 'Gift' },
    { value: 'event', label: 'Event' },
];

interface InteractionFormProps {
    initialData?: UpdateInteractionDto & { id: string, contactId?: string, occurredAt?: string }; // Combine types loosely
    contactId?: string; // Pre-selected contact
    onSuccess?: () => void;
}

export function InteractionForm({ initialData, contactId, onSuccess }: InteractionFormProps) {
    const router = useRouter();
    const isEditing = !!initialData?.id;

    const { mutate: createInteraction, isPending: isCreating } = useCreateInteraction();
    const { mutate: updateInteraction, isPending: isUpdating } = useUpdateInteraction();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>({
        defaultValues: {
            contactId: initialData?.contactId || contactId || "",
            type: initialData?.type || "note",
            content: initialData?.content || "",
            occurredAt: initialData?.occurredAt
                ? new Date(initialData.occurredAt).toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16),
        }
    });

    // Fetch contacts for dropdown
    const { data: contactsData } = useContacts({ limit: 100 });
    const rawContacts = contactsData?.data;
    const contacts = Array.isArray(rawContacts) ? rawContacts : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            occurredAt: new Date(data.occurredAt).toISOString(),
        };

        if (isEditing && initialData?.id) {
            updateInteraction({ id: initialData.id, data: payload }, {
                onSuccess: () => {
                    if (onSuccess) onSuccess();
                    else router.back();
                }
            });
        } else {
            createInteraction(payload, {
                onSuccess: () => {
                    if (onSuccess) onSuccess();
                    else router.back();
                }
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                </label>
                {/* Custom Searchable Select using simple state */}
                <div className="relative">
                    {(!contactId && !isEditing) ? (
                        <SearchableContactSelect
                            onSelect={(id) => setValue("contactId", id)}
                            error={errors.contactId?.message as string}
                        />
                    ) : (
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                            {/* Show selected contact name if possible, or just 'Locked' */}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {contacts.find((c: any) => c.id === (contactId || initialData?.contactId))?.displayName ||
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                contacts.find((c: any) => c.id === (contactId || initialData?.contactId))?.givenName ||
                                "Selected Contact"}
                        </div>
                    )}
                    {/* Hidden input for validation */}
                    <input type="hidden" {...register("contactId", { required: "Contact is required" })} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Type
                    </label>
                    <select
                        {...register("type", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        {INTERACTION_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Date & Time
                    </label>
                    <input
                        type="datetime-local"
                        {...register("occurredAt", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                    Notes / Content
                </label>
                <textarea
                    {...register("content", { required: "Content is required" })}
                    autoFocus
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                            handleSubmit(onSubmit)(e);
                        }
                    }}
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="What happened? (Cmd+Enter to save)"
                />
                {errors.content && <p className="text-sm text-destructive">{errors.content.message as string}</p>}
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : isEditing ? "Update Interaction" : "Log Interaction"}
                </Button>
            </div>
        </form>
    );
}

function SearchableContactSelect({ onSelect, error }: { onSelect: (id: string) => void, error?: string }) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedName, setSelectedName] = useState("");

    // Debounce search or just pass to hook? Hook handles fetching.
    // Use search param in useContacts
    const { data: contactsData, isLoading } = useContacts({ search: search, limit: 10 });
    const contacts = contactsData?.data || (Array.isArray(contactsData) ? contactsData : []) || [];

    // Simple Outside Click handler could be added here, but for MVP standard logic:

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelect = (contact: any) => {
        onSelect(contact.id);
        setSelectedName(contact.displayName || `${contact.givenName} ${contact.familyName}`);
        setSearch("");
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={isOpen ? search : selectedName || search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                    if (!e.target.value) {
                        onSelect("");
                        setSelectedName("");
                    }
                }}
                onFocus={() => {
                    setIsOpen(true);
                    // If we have a selected value, clear search to allow new search? 
                    // Or keep it? Let's clear search input but maybe keep selectedName separate.
                    setSearch("");
                }}
                placeholder="Search contact..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            {isOpen && search && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                    ) : contacts.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No contacts found.</div>
                    ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        contacts.map((contact: any) => (
                            <div
                                key={contact.id}
                                onClick={() => handleSelect(contact)}
                                className="px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
                            >
                                <div className="font-medium">{contact.displayName || `${contact.givenName} ${contact.familyName}`}</div>
                                <div className="text-xs text-muted-foreground">{contact.emailAddresses?.[0]}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
    );
}
