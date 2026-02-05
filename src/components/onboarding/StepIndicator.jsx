import React from 'react';
import { motion } from 'framer-motion';

export default function StepIndicator({ currentStep, totalSteps }) {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-emerald-700">Step {currentStep} of {totalSteps}</span>
                 <span className="text-sm font-semibold text-emerald-800">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2">
                <motion.div
                    className="bg-emerald-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}