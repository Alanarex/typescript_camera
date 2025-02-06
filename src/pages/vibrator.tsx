import { useState } from 'react';

export const vibrateForNotification = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  } else {
    console.warn('Vibration API is not supported by this browser.');
  }
};

const Vibrator = () => {
  const [isVibrating, setIsVibrating] = useState<boolean>(false);

  const handleToggleVibration = () => {
    if (isVibrating) {
      navigator.vibrate(0); // Stop vibration
    } else {
      navigator.vibrate([200, 100, 200]); // Start continuous vibration
    }
    setIsVibrating(!isVibrating);
  };

  return (
    <div>
      <h1>&#128243;Vibrator</h1>
      <button
        onClick={handleToggleVibration}
        className={`vibrate-button ${isVibrating ? 'vibrating' : ''}`}
      >
        {isVibrating ? 'Stop Vibration' : 'Start Vibration'}
      </button>
    </div>
  );
};

export default Vibrator;