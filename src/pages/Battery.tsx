import { useState, useEffect } from 'react';

const BatteryLevel = () => {
    const [batteryLevel, setBatteryLevel] = useState(100);

    useEffect(() => {
        interface Battery {
            level: number;
            addEventListener: (type: string, listener: () => void) => void;
        }

        const updateBatteryStatus = (battery: Battery) => {
            setBatteryLevel(Math.floor(battery.level * 100));
        };

        (navigator as any).getBattery().then((battery: Battery) => {
            updateBatteryStatus(battery);
            battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        });
    }, []);

    const getBatteryStatus = () => {
        if (batteryLevel > 80) {
            return { color: 'green', emoji: '🔋', message: 'Battery is full' };
        } else if (batteryLevel > 50) {
            return { color: 'yellow', emoji: '😊', message: 'Battery is good' };
        } else if (batteryLevel > 20) {
            return { color: 'orange', emoji: '😟', message: 'Battery is low' };
        } else {
            return { color: 'red', emoji: '🔴', message: 'Battery is critical' };
        }
    };

    const { color, emoji, message } = getBatteryStatus();

    return (
        <div style={{ color }}>
            <h1>Battery Level: {batteryLevel}% {emoji}</h1>
            <p>{message}</p>
        </div>
    );
};

export default BatteryLevel;