import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DigitalParcham() {
    const [count, setCount] = useState(786);
    const [raised, setRaised] = useState(false);

    const handleRaise = () => {
        if (!raised) {
            setCount(count + 1);
            setRaised(true);
        }
    };

    return (
        <div className="glassmorphism rounded-2xl p-5 text-center">
            <h3 className="text-lg font-bold mb-2" style={{ color: '#6A0066' }}>🚩 Digital Parcham of Allegiance</h3>
            <p className="text-4xl font-bold transition-transform duration-300" style={{color: raised ? '#FF0066' : '#934790'}}>
                {count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">Parchams Raised for Imam (a.s.)</p>
            <Button onClick={handleRaise} className="primary-btn w-full sm:w-auto" disabled={raised}>
                {raised ? "Your Parcham is Raised!" : "Raise Your Parcham"}
            </Button>
        </div>
    );
}