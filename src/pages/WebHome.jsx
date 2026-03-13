import React from "react";
import WebHeader from "@/components/web/WebHeader";
import WebHero from "@/components/web/WebHero";
import PlatformOverview from "@/components/web/PlatformOverview";
import SpiritualTools from "@/components/web/SpiritualTools";
import MediaSection from "@/components/web/MediaSection";
import CommunityServices from "@/components/web/CommunityServices";
import EventsSection from "@/components/web/EventsSection";
import KidsSection from "@/components/web/KidsSection";
import DonateSection from "@/components/web/DonateSection";
import WebFooter from "@/components/web/WebFooter";

export default function WebHome() {
  return (
    <div className="min-h-screen bg-white">
      <WebHeader />
      <WebHero />
      <PlatformOverview />
      <SpiritualTools />
      <MediaSection />
      <CommunityServices />
      <EventsSection />
      <KidsSection />
      <DonateSection />
      <WebFooter />
    </div>
  );
}