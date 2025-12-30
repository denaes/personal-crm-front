"use client";

import { useState } from "react";
import { X, Plus, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TagManagerProps {
    tags: string[];
    onTagsChange?: (tags: string[]) => void;
    readonly?: boolean;
}

export function TagManager({ tags, onTagsChange, readonly = false }: TagManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            onTagsChange?.([...tags, newTag.trim()]);
            setNewTag("");
            setIsAdding(false);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange?.(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === "Escape") {
            setIsAdding(false);
            setNewTag("");
        }
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <AnimatePresence>
                {tags.map((tag) => (
                    <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="group flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                        <Tag className="w-3 h-3" />
                        {tag}
                        {!readonly && (
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                aria-label={`Remove ${tag} tag`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </motion.span>
                ))}
            </AnimatePresence>

            {!readonly && (
                <>
                    {isAdding ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1"
                        >
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleAddTag}
                                autoFocus
                                placeholder="Tag name..."
                                className="px-3 py-1 text-sm bg-muted border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-32"
                            />
                        </motion.div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Add tag
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
