import React, { useState } from 'react';
import Numpad from '../components/Numpad';
import '../styles/VoiceCall.css';

const VoiceCall = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCall = (number: string) => {
        if (number) {
            window.location.href = `tel:${number}`;
        }
    };

    return (
        <div className="voice-call">
            <Numpad onCall={handleCall} />
        </div>
    );
};

export default VoiceCall;
