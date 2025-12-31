"use client";

import { AppLayout } from "@/components/layout/app-layout";

export default function PrivacyPolicyPage() {
    return (
        <AppLayout>
            <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto glass-effect p-8 rounded-2xl border border-border">
                    <h1 className="font-display text-3xl font-bold mb-8">Privacy Policy</h1>

                    <div className="space-y-6 text-foreground/80">
                        <p className="text-sm text-muted-foreground">Last updated: December 31, 2025</p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Overview</h2>
                            <p>
                                Rinku ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, and store information when you use our Personal CRM application.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Information We Collect</h2>
                            <p>
                                <strong>We only store data that you successfully type or explicitly provide to us.</strong>
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>
                                    <strong>User Input:</strong> Information you enter into the application, such as notes about interactions, reminders, and custom tags.
                                </li>
                                <li>
                                    <strong>Google Contacts:</strong> If you verify Google Contacts integration, we store a cache of your contacts to check for sync status and display them within the app.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">3. How We Use Your Information</h2>
                            <p>
                                We use the information solely to provide the Personal CRM functionality, including:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Managing your relationships and interactions.</li>
                                <li>Sending you reminders.</li>
                                <li>Providing AI-powered insights based on your notes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Security</h2>
                            <p>
                                We implement reasonable security measures to protect the confidentiality and integrity of your data. However, no internet transmission is completely secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us through the application support channels.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
