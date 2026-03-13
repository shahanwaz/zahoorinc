import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Donate", href: "https://zahoorinc.com/app" },
  ],
  legal: [
    { label: "About Us", href: "/AboutUs" },
    { label: "Terms & Conditions", href: "/TermsAndConditions" },
    { label: "Privacy Policy", href: "/PrivacyPolicy" },
    { label: "Help & Support", href: "/HelpAndReportContent" },
  ]
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", color: "#1877F2" },
  { icon: Instagram, href: "https://instagram.com", color: "#E1306C" },
  { icon: Youtube, href: "https://youtube.com", color: "#FF0000" },
  { icon: Twitter, href: "https://x.com", color: "#000000" },
];

export default function WebFooter() {
  return (
    <footer id="about" className="bg-emerald-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/20b523e25_487ad098c_yabaqiyatullah.png"
                alt="Zahoor"
                className="w-12 h-12 rounded-xl"
              />
              <div>
                <span className="text-xl font-bold block">Zahoor</span>
                <span className="text-amber-300 text-xs">Hearts Await Zahoor</span>
              </div>
            </div>
            <p className="text-emerald-300/75 text-sm leading-relaxed">
              Connecting the global Shia community through spiritual knowledge, community services, and educational resources. Building a stronger Ummah together.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-emerald-300/75 hover:text-amber-300 text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-emerald-300/75 hover:text-amber-300 text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-emerald-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-emerald-500/70 text-sm">© 2026 Zahoor. All rights reserved.</p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, color }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, backgroundColor: color }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}