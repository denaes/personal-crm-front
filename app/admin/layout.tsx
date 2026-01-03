"use client";

import { useCurrentUser } from "@/lib/hooks/use-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, Lightbulb, ArrowLeft, ScrollText } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [user, isLoading, router]);


    const navItems = [
        {
            name: "Users",
            href: "/admin/users",
            icon: Users,
        },
        {
            name: "Features",
            href: "/admin/features",
            icon: Lightbulb,
        },
        {
            name: "Audit Logs",
            href: "/admin/audit-logs",
            icon: ScrollText,
        },
    ];

    // Always render layout to maintain consistent hook order in children
    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-background">
                <aside className="w-64 border-r border-border bg-card hidden md:flex md:flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-border">
                        <span className="font-display font-bold text-lg">Super Admin</span>
                    </div>
                </aside>
                <main className="flex-1 overflow-y-auto flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:flex md:flex-col">
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <span className="font-display font-bold text-lg">Super Admin</span>
                </div>
                <nav className="p-4 space-y-2 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="h-16 flex items-center justify-between px-8 border-b border-border bg-card md:hidden">
                    <span className="font-display font-bold text-lg">Super Admin</span>
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
