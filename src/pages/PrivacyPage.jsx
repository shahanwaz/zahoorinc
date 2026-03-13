import React from "react";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-emerald-800 space-y-6">
            <p className="text-sm text-emerald-600">Last Updated: March 2026</p>

            <p className="text-xl leading-relaxed">
              At Zahoor, we are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines how we collect, use, and safeguard your data.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us:</p>
            <ul className="space-y-2 text-emerald-700">
              <li>Account information (name, email, profile details)</li>
              <li>Content you post (questions, comments, reviews)</li>
              <li>Payment and donation information</li>
              <li>Usage data and analytics</li>
              <li>Device and location information</li>
            </ul>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">2. How We Use Your Information</h2>
            <ul className="space-y-2 text-emerald-700">
              <li>To provide and improve our services</li>
              <li>To connect you with scholars and community members</li>
              <li>To process payments and donations</li>
              <li>To send prayer time notifications and updates</li>
              <li>To personalize your experience</li>
              <li>To ensure platform security and prevent abuse</li>
            </ul>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share data only in these circumstances:
            </p>
            <ul className="space-y-2 text-emerald-700">
              <li>With your consent</li>
              <li>With service providers (payment processors, hosting)</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
            </ul>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no system is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="space-y-2 text-emerald-700">
              <li>Access and download your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to data processing</li>
            </ul>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">6. Children's Privacy</h2>
            <p>
              Users must be 13 years or older. We do not knowingly collect data from children under 13. Parents can create supervised accounts for younger children through the Kids section.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">7. Cookies & Tracking</h2>
            <p>
              We use cookies and similar technologies to improve functionality, analyze usage, and personalize content. You can control cookie settings through your browser.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of significant changes via email or platform notification.
            </p>

            <div className="bg-emerald-50 p-6 rounded-lg mt-8">
              <p className="text-emerald-900">
                <strong>Contact Us:</strong> For privacy concerns or data requests, contact us through the Help & Support page or email privacy@zahoorinc.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}