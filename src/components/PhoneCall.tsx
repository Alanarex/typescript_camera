import React, { useEffect } from 'react';

const PhoneCall = ({ number }: { number: string }) => {
    useEffect(() => {
        if (number) {
            window.location.href = `tel:${number}`;
        }
    }, [number]);

    return null;
};

export default PhoneCall;
