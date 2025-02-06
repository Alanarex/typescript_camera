import { useState } from 'react';
import { showNotification } from '../utils/notifications';

const PhoneCall = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleCall = () => {
    if (phoneNumber) {
      showNotification('Calling', { body: `Calling ${phoneNumber}` }, [200, 100, 200]); // Notification with vibration
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('Please enter a valid phone number.');
    }
  };

  return (
    <div>
      <h1> &#128382;Say Hi</h1>
      <input
        type="tel"
        value={phoneNumber}
        onChange={handleInputChange}
        placeholder="Enter phone number"
        className="phone-input"
      />
      <button onClick={handleCall} className="call-button">Call</button>
    </div>
  );
};

export default PhoneCall;