import React from 'react';
import { motion } from 'framer-motion';
import { User, Mic, BookText, Building, HandHeart, Briefcase, GraduationCap, PenSquare } from 'lucide-react';

export default function RoleSelection({ onSelectRole }) {
    const roles = [
        { id: 'general', title: 'General User', icon: User, description: 'Explore, connect, and grow.' },
        { id: 'maulana', title: 'Maulana', icon: GraduationCap, description: 'Guide, teach, and answer.' },
        { id: 'zakir', title: 'Zakir / Zakera', icon: Mic, description: 'Recite and inspire.' },
        { id: 'nauhakwan', title: 'Nauhakwan', icon: BookText, description: 'Share soulful recitations.' },
        { id: 'shayar', title: 'Shayar', icon: PenSquare, description: 'Share spiritual poetry.' },
        { id: 'business', title: 'Business', icon: Briefcase, description: 'List your services or products.' },
        { id: "madarsa", title: "Madarsa", icon: Building, description: "Manage your institution." },
        { id: 'ngo', title: 'NGO', icon: HandHeart, description: 'Manage your organization.' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="text-center">
             <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68874558a4cb8143d474b0a5/8cc7e294e_487ad098c_yabaqiyatullah.png" 
                alt="Zahoor Logo" 
                className="w-24 h-24 mx-auto mb-4 rounded-3xl"
            />
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">Welcome to Zahoor</h1>
            <p className="text-emerald-700 mb-8">How would you like to join our community?</p>

            <motion.div 
                className="grid grid-cols-2 md:grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {roles.map(role => {
                    const Icon = role.icon;
                    return (
                        <motion.div
                            key={role.id}
                            variants={itemVariants}
                            onClick={() => onSelectRole(role.id)}
                            className="glassmorphism rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full mb-3">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-emerald-800 text-sm">{role.title}</h3>
                            <p className="text-emerald-600 text-xs text-center">{role.description}</p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}