"use client"

import React, { useState } from 'react';
import { Metadata } from 'next';

export default function LearnathonTerms() {
    const [activeTab, setActiveTab] = useState('terms');

    const TabButton = ({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-200'
                }`}
        >
            {children}
        </button>
    );

    const TermsContent = () => (
        <main>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8 pb-4 border-b-2 border-blue-500">
                    Learnathon: Institutional Participation Terms and Conditions
                </h1>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Institutional Registration</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">1.1 Open Registration</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>All educational institutions can register</li>
                            <li>No minimum accreditation requirements</li>
                            <li>Open to:
                                <ul className="list-circle pl-6">
                                    <li>Colleges and universities</li>
                                    <li>Technical institutes</li>
                                    <li>Professional schools</li>
                                    <li>Degree-granting institutions</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Payment Structure</h2>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-2">
                            <li>Per student fee: ₹1,000 (Exclusive of GST)</li>
                            <li>Minimum team: 150 students</li>
                            <li>No maximum limit on team size</li>
                            <li>Fee is negotiable for bulk registrations</li>
                            <li>Minimum total registration: ₹150,000</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Student Participation Criteria</h2>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-2">
                            <li>Students must:
                                <ul className="list-circle pl-6">
                                    <li>Be currently enrolled in the institution</li>
                                    <li>Age range: 18-30 years</li>
                                    <li>Have basic interest in technology</li>
                                    <li>Possess fundamental computer skills</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cancellation and Refund Policy</h2>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 className="text-xl font-medium text-red-700 mb-2">NO REFUND POLICY</h3>
                        <p className="mb-2">Absolutely no refunds will be issued for:</p>
                        <ul className="list-disc list-inside">
                            <li>Per-student charges</li>
                            <li>Additional workshop costs</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">Learnathon Team</h3>
                        <p>Email: <a href="mailto:hr@learnathon.live" className="text-blue-600 hover:underline">hr@learnathon.live</a></p>
                        <p>Phone: +91 98493 85818</p>
                    </div>
                </section>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-6">
                    <h3 className="text-xl font-medium mb-2">Important Notes</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>By proceeding with registration, all institutional representatives acknowledge the terms and conditions</li>
                        <li>Pricing is subject to negotiation for bulk registrations</li>
                        <li>All fees are exclusive of GST</li>
                    </ul>
                </div>

                <footer className="text-center text-gray-500 pt-6 border-t">
                    <p>© 2024 Learnathon. All rights reserved.</p>
                    <p>Version 1.2 - Last Updated: November 26th, 2024</p>
                </footer>
            </div>
        </main>
    );

    const PrivacyContent = () => (
        <main>
            <h1 className="text-3xl font-bold text-center mb-8 pb-4 border-b-2 border-blue-500">
                Learnathon Privacy Policy
            </h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information Collection</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">1.1 Types of Personal Information</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Full name and contact details</li>
                        <li>Institutional identification</li>
                        <li>Academic information (department, year)</li>
                        <li>Email address and phone number</li>
                        <li>IP address and device information</li>
                        <li>Event participation and performance data</li>
                    </ul>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Data Usage</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">2.1 Primary Purposes</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Event registration and management</li>
                        <li>Performance evaluation</li>
                        <li>Communication with participants</li>
                        <li>Technical skill assessment</li>
                        <li>Compliance and verification</li>
                    </ul>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Protection</h2>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">3.1 Security Measures</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>256-bit SSL encryption</li>
                        <li>Secure cloud storage</li>
                        <li>Regular security audits</li>
                        <li>Restricted access controls</li>
                        <li>Multi-factor authentication for administrators</li>
                    </ul>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Rights</h2>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">4.1 Data Access and Control</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Right to request personal information collected</li>
                        <li>Ability to correct inaccurate information</li>
                        <li>Option to request data deletion</li>
                        <li>Withdraw consent at any time</li>
                    </ul>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Contact Information</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Data Protection Officer</h3>
                    <p>Email: <a href="mailto:privacy@learnathon.live" className="text-blue-600 hover:underline">privacy@learnathon.live</a></p>
                    <p>Phone: +91 98493 85819</p>
                </div>
            </section>

            <footer className="text-center text-gray-500 pt-6 border-t">
                <p>© 2024 Learnathon. All rights reserved.</p>
                <p>Version 1.0 - Effective Date: November 29th, 2024</p>
            </footer>
        </main>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-center mb-6 space-x-4">
                <TabButton
                    isActive={activeTab === 'terms'}
                    onClick={() => setActiveTab('terms')}
                >
                    Terms & Conditions
                </TabButton>
                <TabButton
                    isActive={activeTab === 'privacy'}
                    onClick={() => setActiveTab('privacy')}
                >
                    Privacy Policy
                </TabButton>
            </div>

            {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}

            <div className="text-center mt-6">
                <button
                    onClick={() => {
                        // go back
                        window.history.back();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Proceed to Registration
                </button>
            </div>
        </div>
    );
}