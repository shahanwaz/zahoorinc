import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SpiritualToolsSection from "@/components/landing/SpiritualToolsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFDF9]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <SpiritualToolsSection />
      <HowItWorksSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}