"use client";

import { AppLayout } from "@/components/layout/app-layout";

export default function TermsOfServicePage() {
    return (
        <AppLayout>
            <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto glass-effect p-8 rounded-2xl border border-border">
                    <h1 className="font-display text-3xl font-bold mb-8">Terms of Service</h1>

                    <div className="space-y-6 text-foreground/80">
                        <p className="text-sm text-muted-foreground">Last updated: December 31, 2025</p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using Rinku (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Use of the Service</h2>
                            <p>
                                You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Content</h2>
                            <p>
                                You retain ownership of the data you input into the Service. By using the Service, you grant us a license to process this data solely for the purpose of providing the Service to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Termination</h2>
                            <p>
                                We reserve the right to terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Disclaimer</h2>
                            <p>
                                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation of the Service or the accuracy of the data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Limitation of Liability</h2>
                            <p>
                                In no event shall Rinku be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
