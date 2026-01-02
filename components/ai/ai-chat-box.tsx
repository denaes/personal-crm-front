"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, X, Bot, User } from "lucide-react";
import { useAiCommand, type CommandResponse } from "@/lib/hooks/use-ai-command";
import { ContactMentionPicker } from "./contact-mention-picker";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    toolsUsed?: string[];
}

interface Contact {
    id: string;
    displayName: string;
    emailAddresses: string[];
    photoUrl?: string;
    givenName: string;
    familyName?: string;
}

interface MentionData {
    [mentionText: string]: string; // Maps "@DisplayName" to contact ID
}

export function AiChatBox() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [showMentionPicker, setShowMentionPicker] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStartPos, setMentionStartPos] = useState(0);
    const [mentions, setMentions] = useState<MentionData>({});
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutate: sendCommand, isPending } = useAiCommand();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // Keyboard shortcut (Cmd+/)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "/") {
                e.preventDefault();
                setIsExpanded((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, []);

    // Focus input when expanded without scrolling
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    }, [isExpanded]);

    // Save messages to session storage
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem("ai-chat-messages", JSON.stringify(messages));
        }
    }, [messages]);

    // Detect "@" mentions in input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        // Get cursor position
        const cursorPos = e.target.selectionStart || 0;

        // Find the last "@" before cursor
        const textBeforeCursor = value.slice(0, cursorPos);
        const lastAtIndex = textBeforeCursor.lastIndexOf("@");

        if (lastAtIndex !== -1) {
            // Check if "@" is at word boundary (start of string or preceded by space)
            const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : " ";
            const isWordBoundary = charBeforeAt === " " || charBeforeAt === "\n";

            if (isWordBoundary) {
                // Extract the query after "@"
                const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
                // Check if there's a space after "@" (which would close the mention)
                const hasSpace = textAfterAt.includes(" ");

                if (!hasSpace) {
                    setMentionQuery(textAfterAt);
                    setMentionStartPos(lastAtIndex);
                    setShowMentionPicker(true);
                    return;
                }
            }
        }

        // Close picker if no valid "@" found
        setShowMentionPicker(false);
    };

    // Handle contact selection from mention picker
    const handleContactSelect = (contact: Contact) => {
        const mentionText = `@${contact.displayName}`;

        // Replace "@query" with the full mention
        const beforeMention = input.slice(0, mentionStartPos);
        const afterMention = input.slice(inputRef.current?.selectionStart || input.length);
        const newInput = beforeMention + mentionText + " " + afterMention;

        setInput(newInput);

        // Store mention mapping
        setMentions(prev => ({
            ...prev,
            [mentionText]: contact.id
        }));

        setShowMentionPicker(false);

        // Refocus input and move cursor after mention
        setTimeout(() => {
            if (inputRef.current) {
                const newCursorPos = beforeMention.length + mentionText.length + 1;
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 10);
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Extract mentioned contact IDs
        const mentionedContactIds: string[] = [];
        Object.entries(mentions).forEach(([mentionText, contactId]) => {
            if (input.includes(mentionText)) {
                mentionedContactIds.push(contactId);
            }
        });

        // Clear input and mentions
        setInput("");
        setMentions({});

        // Send to backend with mentioned contact IDs
        sendCommand(
            {
                message: userMessage.content,
                mentionedContactIds
            },
            {
                onSuccess: (response: CommandResponse) => {
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: response.success
                            ? response.message
                            : `Sorry, I encountered an error: ${response.error?.details || "Unknown error"}`,
                        timestamp: new Date(),
                        toolsUsed: response.toolsUsed,
                    };
                    setMessages((prev) => [...prev, assistantMessage]);
                },
                onError: (error) => {
                    const errorMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: `Sorry, I couldn't process your request. Please try again. (${error.message})`,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Don't handle Enter if mention picker is open
        if (showMentionPicker) {
            return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleSend(e as any);
        }
    };

    const clearHistory = () => {
        setMessages([]);
        sessionStorage.removeItem("ai-chat-messages");
    };

    // Render message content with styled mentions
    const renderMessageContent = (content: string) => {
        const mentionRegex = /@[\w\s]+/g;
        const parts = content.split(mentionRegex);
        const matches = content.match(mentionRegex) || [];

        return (
            <>
                {parts.map((part, i) => (
                    <span key={i}>
                        {part}
                        {matches[i] && (
                            <span className="text-primary font-semibold">
                                {matches[i]}
                            </span>
                        )}
                    </span>
                ))}
            </>
        );
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            {!isExpanded && (
                <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setIsExpanded(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-300 group"
                >
                    <Bot className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Ask AI Assistant</span>
                    <span className="text-xs text-muted-foreground ml-auto">Cmd+/</span>
                </motion.button>
            )}

            {/* Expanded Chat Interface */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "400px" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 backdrop-blur-sm"
                    >
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">AI Assistant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {messages.length > 0 && (
                                        <button
                                            onClick={clearHistory}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                            >
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                                        <Bot className="w-12 h-12 mb-3 opacity-50" />
                                        <p className="text-sm">
                                            Try commands like:
                                        </p>
                                        <ul className="text-xs mt-2 space-y-1">
                                            <li>&quot;add note to @John: great meeting today&quot;</li>
                                            <li>&quot;remind me to call @Sarah tomorrow at 2pm&quot;</li>
                                            <li>&quot;mark @Patrick as high priority&quot;</li>
                                        </ul>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            {message.role === "assistant" && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                                                    <Bot className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-foreground"
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {renderMessageContent(message.content)}
                                                </p>
                                                {message.toolsUsed && message.toolsUsed.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-border/50">
                                                        <p className="text-xs opacity-70">
                                                            Used: {message.toolsUsed.join(", ")}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            {message.role === "user" && (
                                                <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                {isPending && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                                        </div>
                                        <div className="bg-muted rounded-lg px-4 py-2">
                                            <p className="text-sm text-muted-foreground">Thinking...</p>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-border bg-background/50 relative">
                                {/* Mention Picker */}
                                <AnimatePresence>
                                    {showMentionPicker && (
                                        <ContactMentionPicker
                                            searchQuery={mentionQuery}
                                            onSelect={handleContactSelect}
                                            onClose={() => setShowMentionPicker(false)}
                                            position={{
                                                bottom: 60,
                                                left: 0,
                                            }}
                                        />
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a command... (use @ to mention contacts)"
                                        disabled={isPending}
                                        className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={!input.trim() || isPending}
                                        className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
