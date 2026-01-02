"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Users,
    MessageSquare,
    Bell,
    Search,
    LogOut,
    Menu,
    X,
    Lightbulb,
    Shield,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth-store";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Interactions", href: "/interactions", icon: MessageSquare },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Features", href: "/features", icon: Lightbulb },
    // { name: "Settings", href: "/settings", icon: Settings },
];

interface NavbarProps {
    onSearchOpen?: () => void;
}

export function Navbar({ onSearchOpen }: NavbarProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Keyboard shortcut for search (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                onSearchOpen?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onSearchOpen]);

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 font-display text-xl font-bold"
                    >
                        <Image
                            src="/logo.png"
                            alt="Rinku Logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="hidden sm:inline">Rinku</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                                    pathname.startsWith("/admin")
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Super Admin</span>
                            </Link>
                        )}
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button */}
                        <button
                            onClick={onSearchOpen}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm text-muted-foreground"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Search</span>
                            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>

                        {/* Logout (Desktop) */}
                        <button
                            onClick={() => {
                                // Clear auth and redirect
                                localStorage.removeItem("auth_token");
                                window.location.href = "/";
                            }}
                            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-1">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    pathname.startsWith("/admin")
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted text-muted-foreground"
                                )}
                            >
                                <Shield className="w-5 h-5" />
                                <span className="font-medium">Super Admin</span>
                            </Link>
                        )}
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={() => {
                                localStorage.removeItem("auth_token");
                                window.location.href = "/";
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
