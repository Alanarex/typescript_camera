import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLocation } from '../context/LocationContext';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLocationData } = useLocation();

  const handleLogin = async () => {
    if (username && phoneNumber && !isNaN(Number(phoneNumber))) {
      localStorage.setItem('login', username);
      localStorage.setItem('phoneNumber', phoneNumber);

      setLoading(true);

      // Fetch location data
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        const locationData = {
          latitude,
          longitude,
          city: data.address.city || 'Unknown',
          country: data.address.country || 'Unknown'
        };

        setLocationData(locationData);
        sessionStorage.setItem('locationData', JSON.stringify(locationData));
        console.log("📍 Location stored in session and context:", locationData);

        // Navigate to the home page after successful login
        navigate('/home');
      } catch (error) {
        console.error("⚠️ Error loading location data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Location Error',
          text: 'Unable to fetch location data. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter both name and a valid phone number.',
      });
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
        className="input-field"
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter your phone number"
        className="input-field"
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? (
          <div className="spinner"></div>
        ) : 'Login'}
      </button>
    </div>
  );
};

export default Login;
