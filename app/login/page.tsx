"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Chrome, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-6">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>

                {/* Login card */}
                <div className="glass-effect p-8 rounded-2xl border border-white/20">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/70">
                            Sign in to access your Personal CRM
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        <Chrome className="w-5 h-5" />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-white/50">
                                Secure authentication
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-white/60">
                            By signing in, you agree to sync your Google Contacts
                        </p>
                        <p className="text-xs text-white/40">
                            Your data is encrypted and secure
                        </p>
                    </div>
                </div>

                {/* Additional info */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-6 text-white/50 text-sm"
                >
                    Don&apos;t have a Google account?{" "}
                    <a
                        href="https://accounts.google.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Create one
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
}
