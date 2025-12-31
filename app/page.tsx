"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Brain, Calendar } from "lucide-react";

import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden flex-1">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white/90">AI-Powered Relationship Management</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-6xl md:text-7xl font-bold mb-6"
            >
              <span className="text-white">Never Lose Touch</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Stay Connected
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
            >
              Manage your personal relationships with intelligence. Sync with Google Contacts,
              get AI-powered insights, and never miss an important moment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/login"
                className="group px-8 py-4 bg-gradient-primary rounded-xl text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto"
          >
            {/* Feature 1 */}
            <div className="glass-effect p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-display text-xl font-semibold mb-2">
                Smart Contact Management
              </h3>
              <p className="text-white/70">
                Sync seamlessly with Google Contacts and organize your relationships with custom tags and priorities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-display text-xl font-semibold mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-white/70">
                Get intelligent suggestions on when to reach out and what to say based on your interaction history.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-display text-xl font-semibold mb-2">
                Never Forget
              </h3>
              <p className="text-white/70">
                Automatic reminders ensure you stay in touch at the right frequency for each relationship.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
