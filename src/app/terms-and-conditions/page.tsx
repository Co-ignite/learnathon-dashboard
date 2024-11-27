import React from 'react';
import Head from 'next/head';

export default function LearnathonTerms() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Head>
                <title>Learnathon: Institutional Participation Terms and Conditions</title>
                <meta name="description" content="Learnathon Institutional Participation Terms and Conditions" />
            </Head>

            <main>
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
            </main>
        </div>
    );
}