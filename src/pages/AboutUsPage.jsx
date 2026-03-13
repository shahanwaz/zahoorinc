import React from "react";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-emerald-900 mb-6">About Zahoor</h1>
          <div className="prose prose-lg max-w-none text-emerald-800 space-y-6">
            <p className="text-xl leading-relaxed">
              Zahoor is a comprehensive digital platform dedicated to connecting and serving the global Shia Muslim community. Our mission is to provide spiritual guidance, educational resources, and community services through modern technology.
            </p>
            
            <h2 className="text-3xl font-bold text-emerald-900 mt-8">Our Vision</h2>
            <p>
              We envision a world where every member of the Shia community has easy access to authentic Islamic knowledge, can connect with scholars and fellow believers, and actively participates in strengthening our Ummah.
            </p>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">What We Offer</h2>
            <ul className="space-y-3 text-emerald-700">
              <li><strong>Spiritual Guidance:</strong> Connect with verified scholars for Istikhara and religious questions</li>
              <li><strong>Educational Content:</strong> Access lectures, Majalis, Quran Tafseer, and Islamic history</li>
              <li><strong>Community Services:</strong> Find Maulanas, Ejara services, and local events</li>
              <li><strong>Daily Tools:</strong> Prayer times, Duas, Hadith, Qibla compass, and more</li>
              <li><strong>Kids Section:</strong> Islamic stories and educational content for young learners</li>
            </ul>

            <h2 className="text-3xl font-bold text-emerald-900 mt-8">Our Commitment</h2>
            <p>
              We are committed to maintaining authenticity, respecting privacy, and fostering a safe and respectful environment for all community members. All content is carefully curated and verified by qualified scholars.
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-8">
              <p className="text-emerald-900 font-semibold italic">
                "And hold firmly to the rope of Allah all together and do not become divided." - Quran 3:103
              </p>
            </div>
          </div>
        </div>
      </main>
      <WebFooter />
    </div>
  );
}