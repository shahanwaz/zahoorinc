import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import DonationModal from "@/components/donations/DonationModal";
import HeroSlider from "@/components/donations/HeroSlider";
import DonationGrid from "@/components/donations/DonationGrid";
import Leaderboard from "@/components/donations/Leaderboard";
import ImpactGallery from "@/components/donations/ImpactGallery";
import NgoInvitation from "@/components/donations/NgoInvitation";
import AppFooter from "@/components/donations/AppFooter";
import { Button } from "@/components/ui/button";

export default function DonationSupport() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ amount: '', type: 'Chanda' });

  const openModal = (type = 'Chanda', amount = '') => {
    setModalConfig({ type, amount });
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <DonationModal open={isModalOpen} onOpenChange={setIsModalOpen} initialAmount={modalConfig.amount} initialType={modalConfig.type} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-emerald-100 mr-2">
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
          </Button>
          <h1 className="text-xl font-bold text-emerald-800">Donation & Support</h1>
        </div>
      </header>

      <main className="space-y-12 md:space-y-16 pb-16">
        <HeroSlider onPrimaryAction={openModal} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <DonationGrid onSelectCategory={openModal} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Leaderboard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ImpactGallery />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4"
        >
          <NgoInvitation />
        </motion.div>
      </main>
      
      <AppFooter />
    </div>
  );
}