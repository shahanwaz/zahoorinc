import React from "react";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">Terms & Conditions</h1>
          <div className="prose prose-lg max-w-none text-emerald-800 space-y-6">
            <p className="text-sm text-emerald-600">Last Updated: March 2026</p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Zahoor, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">2. Use of Services</h2>
            <p>
              Zahoor provides Islamic educational content, community services, and spiritual guidance tools. You agree to use these services in accordance with Islamic principles and community guidelines.
            </p>
            <ul className="space-y-2 text-emerald-700">
              <li>All content must be respectful and appropriate</li>
              <li>Misinformation or false teachings are prohibited</li>
              <li>Spam, harassment, or abusive behavior will result in account termination</li>
              <li>You must be 13 years or older to use our services</li>
            </ul>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">3. User Content</h2>
            <p>
              Users may post questions, share content, and participate in community discussions. You retain ownership of your content but grant Zahoor a license to use, display, and distribute it within the platform.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">4. Payments & Donations</h2>
            <p>
              Donations and service payments are processed securely. All transactions are final unless otherwise stated. We reserve the right to refund or cancel transactions at our discretion.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">5. Intellectual Property</h2>
            <p>
              All content, trademarks, and materials on Zahoor are protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">6. Limitation of Liability</h2>
            <p>
              Zahoor provides information and services "as is" without warranty. We are not liable for any damages arising from use of our services. Spiritual guidance should be supplemented with consultation from qualified scholars.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>

            <div className="bg-emerald-50 p-6 rounded-lg mt-8">
              <p className="text-emerald-900">
                <strong>Contact Us:</strong> For questions about these terms, please contact our support team through the Help & Support page.
              </p>
            </div>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}