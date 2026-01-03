"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

import { useContacts, Contact } from "@/lib/hooks/use-contacts";
import { getInitials } from "@/lib/utils";

interface ContactMentionPickerProps {
    searchQuery: string;
    onSelect: (contact: Contact) => void;
    onClose: () => void;
    position?: { top?: number; bottom?: number; left: number };
}

export function ContactMentionPicker({
    searchQuery,
    onSelect,
    onClose,
    position,
}: ContactMentionPickerProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Fetch contacts with search query
    const { data: contactsData, isLoading } = useContacts({
        search: searchQuery,
        limit: 10,
    });

    // Extract contacts from the response
    const contacts = useMemo(() => contactsData?.data || [], [contactsData]);

    // Reset selected index when search results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [contacts]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!contacts.length) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < contacts.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (contacts[selectedIndex]) {
                        onSelect(contacts[selectedIndex]);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [contacts, selectedIndex, onSelect, onClose]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Auto-scroll selected item into view
    useEffect(() => {
        const selectedElement = pickerRef.current?.querySelector(
            `[data-index="${selectedIndex}"]`
        );
        selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [selectedIndex]);

    if (isLoading) {
        return (
            <motion.div
                ref={pickerRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={position}
                className="absolute z-50 w-80 bg-background border border-border rounded-lg shadow-lg p-3"
            >
                <p className="text-sm text-muted-foreground text-center">
                    Loading contacts...
                </p>
            </motion.div>
        );
    }

    if (!contacts.length) {
        return (
            <motion.div
                ref={pickerRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={position}
                className="absolute z-50 w-80 bg-background border border-border rounded-lg shadow-lg p-3"
            >
                <p className="text-sm text-muted-foreground text-center">
                    No contacts found
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={position}
            className="absolute z-50 w-80 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
        >
            <div className="max-h-64 overflow-y-auto">
                {contacts.map((contact: Contact, index: number) => {
                    const displayName = contact.displayName || `${contact.givenName} ${contact.familyName || ''}`.trim();

                    return (
                        <div
                            key={contact.id}
                            data-index={index}
                            onClick={() => onSelect(contact)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${index === selectedIndex
                                ? "bg-primary/10 border-l-2 border-primary"
                                : "hover:bg-muted/50"
                                }`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                {contact.photoUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={contact.photoUrl}
                                        alt={displayName}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    getInitials(displayName)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {displayName}
                                </p>
                                {contact.emailAddresses?.[0] && (
                                    <p className="text-xs text-muted-foreground truncate">
                                        {contact.emailAddresses[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
