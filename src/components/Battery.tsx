import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Battery.css';

interface Battery {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

const Battery = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  const updateBatteryStatus = (battery: Battery) => {
    setBatteryLevel(Math.floor(battery.level * 100));
    setIsCharging(battery.charging);
  };

  useEffect(() => {
    const handleBattery = async () => {
      const battery: Battery = await (navigator as any).getBattery();
      updateBatteryStatus(battery);
      battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
      battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));

      return () => {
        battery.removeEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.removeEventListener('chargingchange', () => updateBatteryStatus(battery));
      };
    };

    handleBattery();
  }, []);

  const getBatteryColor = () => {
    if (batteryLevel !== null) {
      if (batteryLevel > 50) return 'green';
      if (batteryLevel > 20) return 'yellow';
      return 'red';
    }
    return 'gray';
  };

  return (
    <div className="battery-container">
      <div className="battery" style={{ borderColor: 'white' }}>
        <div className="battery-level" style={{ width: `${batteryLevel}%`, backgroundColor: getBatteryColor() }}>
          {isCharging && <FontAwesomeIcon icon={faBolt} className="bolt" />}
        </div>
        <div className="battery-tip"></div>
      </div>
      <span>{batteryLevel !== null ? `${batteryLevel}%` : 'Loading...'}</span>
    </div>
  );
};

export default Battery;
