import React from "react";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";
import { Heart, Users, BookOpen, Home } from "lucide-react";

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-white">
      <WebHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-emerald-900 mb-4">Support Our Community</h1>
            <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
              Your generosity helps us serve the Ummah better. Every contribution makes a difference in someone's spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 p-8 rounded-2xl border-2 border-emerald-200">
              <Users className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Community Programs</h3>
              <p className="text-emerald-700 mb-4">
                Support educational programs, youth activities, and community gatherings that strengthen our faith and unity.
              </p>
              <ul className="space-y-2 text-emerald-700 text-sm">
                <li>• Islamic classes and workshops</li>
                <li>• Youth mentorship programs</li>
                <li>• Community events and Majalis</li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-8 rounded-2xl border-2 border-emerald-200">
              <BookOpen className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Educational Resources</h3>
              <p className="text-emerald-700 mb-4">
                Help us create and maintain high-quality Islamic educational content for all ages.
              </p>
              <ul className="space-y-2 text-emerald-700 text-sm">
                <li>• Lecture recordings and transcriptions</li>
                <li>• Kids Islamic stories and materials</li>
                <li>• Quranic study resources</li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-8 rounded-2xl border-2 border-emerald-200">
              <Home className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Mosque Support</h3>
              <p className="text-emerald-700 mb-4">
                Contribute to the maintenance and operations of local mosques and Imambargahs.
              </p>
              <ul className="space-y-2 text-emerald-700 text-sm">
                <li>• Building maintenance</li>
                <li>• Utility bills and operations</li>
                <li>• Community service programs</li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-8 rounded-2xl border-2 border-emerald-200">
              <Heart className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Platform Development</h3>
              <p className="text-emerald-700 mb-4">
                Help us improve and expand Zahoor to serve more community members worldwide.
              </p>
              <ul className="space-y-2 text-emerald-700 text-sm">
                <li>• New features and improvements</li>
                <li>• Server and hosting costs</li>
                <li>• Technical maintenance</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-10 rounded-2xl text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Download the Zahoor app to make a secure donation. Choose your cause, set your amount, and contribute to the Ummah.
            </p>
            <a
              href="https://zahoorinc.com/app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-white text-emerald-700 font-bold text-lg rounded-xl hover:bg-emerald-50 transition-all shadow-xl"
            >
              Donate Now via App
            </a>
          </div>

          <div className="mt-12 bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
            <p className="text-emerald-900 italic">
              "The example of those who spend their wealth in the way of Allah is like a seed that grows seven spikes; in each spike is a hundred grains." - Quran 2:261
            </p>
          </div>

          <div className="mt-12 text-center text-emerald-700">
            <p className="text-sm">
              <strong>Tax Information:</strong> Zahoor is a registered non-profit organization. Donations may be tax-deductible. Consult your tax advisor for details.
            </p>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}