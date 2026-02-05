import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';

import RoleSelection from '@/components/onboarding/RoleSelection';
import StepIndicator from '@/components/onboarding/StepIndicator';
import GeneralUserProfile from '@/components/onboarding/GeneralUserProfile';
import ProfessionalProfile from '@/components/onboarding/ProfessionalProfile';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null);

    const rolesConfig = {
        'general': { steps: 3, title: "General User" },
        'maulana': { steps: 4, title: "Maulana" },
        'zakir': { steps: 4, title: "Zakir / Zakera" },
        'nauhakwan': { steps: 4, title: "Nauhakwan / Marsiyakhwan" },
        'shayar': { steps: 4, title: "Shayar (Poet)" },
        'business': { steps: 4, title: "Business Owner" },
        'madarsa': { steps: 4, title: "Madarsa / Islamic School" },
        'ngo': { steps: 4, title: "NGO / Community Organization" }
    };

    const totalSteps = selectedRole ? rolesConfig[selectedRole].steps : 1;

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        nextStep();
    };

    const finishOnboarding = () => {
        // Here you would typically save all user data
        navigate(createPageUrl('Home'));
    };
    
    const renderStep = () => {
        const commonProps = { nextStep, prevStep, setStep };

        switch (step) {
            case 1:
                return <RoleSelection onSelectRole={handleRoleSelect} />;
            case 2:
                if (selectedRole === 'general') {
                    return <GeneralUserProfile {...commonProps} />;
                }
                return <ProfessionalProfile {...commonProps} role={selectedRole} roleTitle={rolesConfig[selectedRole].title} />;
            case 3:
                if (selectedRole === 'general') {
                    return <WelcomeScreen onFinish={finishOnboarding} />;
                }
                 // This would be verification/availability for professional roles
                return <ProfessionalProfile {...commonProps} role={selectedRole} roleTitle={rolesConfig[selectedRole].title} isSecondStep={true} />;
            case 4:
                 // Final welcome screen for professional roles
                return <WelcomeScreen onFinish={finishOnboarding} />;
            default:
                return <RoleSelection onSelectRole={handleRoleSelect} />;
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50 flex flex-col justify-center items-center p-4 font-sans">
            <div className="w-full max-w-lg mx-auto">
                 {step > 1 && <StepIndicator currentStep={step} totalSteps={totalSteps} />}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}