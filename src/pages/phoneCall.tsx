import { useState } from 'react';

const PhoneCall = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('Please enter a valid phone number.');
    }
  };

  return (
    <div>
      <h1>Say Hi &#128382;</h1>
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