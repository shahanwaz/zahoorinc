import React from "react";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";
import { MessageCircle, Mail, Phone, HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">Help & Support</h1>
          <p className="text-xl text-emerald-700 mb-12">
            We're here to help you get the most out of Zahoor. Find answers to common questions or reach out to our support team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <MessageCircle className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Live Chat</h3>
              <p className="text-emerald-700 text-sm">Available in the mobile app</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <Mail className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Email Support</h3>
              <p className="text-emerald-700 text-sm">support@zahoorinc.com</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <Phone className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Phone</h3>
              <p className="text-emerald-700 text-sm">Available Mon-Fri 9AM-6PM</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-emerald-900">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  How do I download the Zahoor app?
                </h3>
                <p className="text-emerald-700">
                  Visit <a href="https://zahoorinc.com/app" className="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">zahoorinc.com/app</a> to download for iOS or Android. The app is free and available worldwide.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Is Zahoor free to use?
                </h3>
                <p className="text-emerald-700">
                  Yes! Core features like prayer times, Duas, Q&A, and community events are completely free. Premium features and donations are optional.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  How do I request Istikhara?
                </h3>
                <p className="text-emerald-700">
                  Download the app, navigate to the Istikhara section, and submit your request. Qualified scholars will provide guidance privately within 24-48 hours.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  How can I find a Maulana for an event?
                </h3>
                <p className="text-emerald-700">
                  Use the "Find Maulana" feature in the app. Browse verified scholars by location, services offered, and availability. Contact them directly through the platform.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  How do donations work?
                </h3>
                <p className="text-emerald-700">
                  All donations are processed securely and go directly to community causes, mosques, or charitable organizations. You'll receive a confirmation and optional receipt.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  How do I report inappropriate content?
                </h3>
                <p className="text-emerald-700">
                  Use the report button on any post, comment, or profile. Our moderation team reviews all reports within 24 hours and takes appropriate action.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 rounded-2xl text-white mt-12">
              <h3 className="text-2xl font-bold mb-3">Still need help?</h3>
              <p className="mb-6">Our support team is ready to assist you with any questions or concerns.</p>
              <a
                href="https://zahoorinc.com/app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all"
              >
                Contact Support in App
              </a>
            </div>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}