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
    <div className="min-h-screen overflow-x-hidden bg-[#FAFDF9] landing-page-root" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .landing-page-root h1,
        .landing-page-root h2,
        .landing-page-root h3,
        .landing-page-root h4,
        .landing-page-root h5,
        .landing-page-root h6 {
          color: inherit;
        }
        .landing-page-root {
          color: #1a1a1a;
        }
      `}</style>
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