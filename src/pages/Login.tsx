import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLocation } from '../context/LocationContext';
import { socket } from '../context/socket';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const { setLocationData } = useLocation();

  useEffect(() => {
   fetch(`${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_API_PREFIX}/online-users`)
  .then(res => res.json())
      .then(users => setOnlineUsers(users));
  }, []);

  const handleLogin = async () => {
    if (onlineUsers.includes(username)) {
      Swal.fire({
        icon: 'error',
        title: 'Username Taken',
        text: 'This username is already taken. Please choose another one.',
      });
      return;
    }

    if (username && phoneNumber && !isNaN(Number(phoneNumber))) {
      localStorage.setItem('login', username);
      localStorage.setItem('phoneNumber', phoneNumber);
      onlineUsers.push(username);
      localStorage.setItem('users', JSON.stringify(onlineUsers));

      setLoading(true);

      socket.connect();
      socket.emit('user-online', username);

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
        localStorage.setItem('locationData', JSON.stringify(locationData));

        // Navigate to home page after login
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
