"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    Users,
    Brain,
    Calendar,
    ArrowRight,
    Check,
    Zap,
    Target,
    MessageSquare,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        {
            icon: Brain,
            title: "AI-Powered Assistant",
            description:
                "Let AI handle 95% of the work. @mention contacts and watch the magic happen.",
            gradient: "from-purple-500 to-blue-500",
        },
        {
            icon: Users,
            title: "Smart Contact Management",
            description:
                "Seamlessly sync with Google Contacts. Never lose track of important relationships.",
            gradient: "from-cyan-500 to-blue-500",
        },
        {
            icon: Calendar,
            title: "Never Miss a Follow-Up",
            description:
                "Intelligent reminders ensure you stay on top of every relationship.",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            icon: MessageSquare,
            title: "Interaction Tracking",
            description:
                "Automatically log emails, calls, meetings, and notes. Your relationship history at a glance.",
            gradient: "from-orange-500 to-red-500",
        },
        {
            icon: Target,
            title: "Priority Management",
            description:
                "Focus on what matters. Tag and prioritize contacts based on your networking goals.",
            gradient: "from-green-500 to-cyan-500",
        },
        {
            icon: TrendingUp,
            title: "Relationship Insights",
            description:
                "AI analyzes patterns and suggests when to reach out. Build stronger connections.",
            gradient: "from-indigo-500 to-purple-500",
        },
    ];

    const howItWorks = [
        {
            step: "1",
            title: "Connect Your Google Account",
            description:
                "Securely sync your contacts in seconds. We never store your password.",
        },
        {
            step: "2",
            title: "Let AI Do the Heavy Lifting",
            description:
                "Our AI assistant analyzes your network and suggests personalized actions.",
        },
        {
            step: "3",
            title: "Focus on What Matters",
            description:
                "You handle the 5% that requires a human touch. We'll handle the rest.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg"
                        : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="Rinku Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="text-2xl font-bold gradient-text font-display">
                                Rinku
                            </span>
                        </div>
                        <Link
                            href="/login"
                            className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Start Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-8"
                        >
                            <Sparkles className="w-4 h-4" />
                            AI does 95% of the work, you do the rest
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
                            Your{" "}
                            <span className="gradient-text">AI-Powered</span>
                            <br />
                            Relationship Manager
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            For individuals who network extensively and stay in
                            touch with many people. Never let a valuable
                            relationship slip through the cracks.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/login"
                                className="group px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                Start Now - It's Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <p className="text-sm text-muted-foreground mt-4">
                            No credit card required • Free forever
                        </p>
                    </motion.div>

                    {/* Hero Image/Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
                        <div className="relative glass-effect rounded-2xl p-2 border-2 border-primary/20">
                            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8 md:p-16 min-h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <Zap className="w-24 h-24 text-primary mx-auto mb-4" />
                                    <p className="text-lg text-muted-foreground">
                                        Dashboard Screenshot Coming Soon
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent to-background">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Everything You Need to{" "}
                            <span className="gradient-text">
                                Master Your Network
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed for modern networkers
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                            >
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                            Get Started in{" "}
                            <span className="gradient-text">3 Simple Steps</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-8">
                        {howItWorks.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                    {item.step}
                                </div>
                                <div className="flex-1 pt-2">
                                    <h3 className="text-2xl font-semibold mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Start Building Better Relationships
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-accent p-12 md:p-16 text-center text-white"
                    >
                        <div className="absolute inset-0 bg-grid-white/10"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                                Ready to Transform Your Network?
                            </h2>
                            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                                Join hundreds of professionals who never miss a
                                follow-up
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                Get Started for Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-background py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Rinku Logo"
                                    width={32}
                                    height={32}
                                    className="rounded-lg"
                                />
                                <span className="text-xl font-bold gradient-text font-display">
                                    Rinku
                                </span>
                            </div>
                            <p className="text-muted-foreground max-w-md">
                                Your AI-powered relationship manager. Network
                                smarter, not harder.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/features"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/login"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                        <p>© 2025 Rinku. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
