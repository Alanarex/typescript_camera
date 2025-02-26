import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && phoneNumber && !isNaN(Number(phoneNumber))) {
      localStorage.setItem('login', username);
      localStorage.setItem('phoneNumber', phoneNumber);
      navigate('/home');
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
