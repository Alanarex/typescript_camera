import { useNavigate } from 'react-router-dom';
import { socket } from '../context/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPhone, faVideo, faImages, faEnvelope, faCog } from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const username = localStorage.getItem('login');
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    if (username) {
      socket.emit('user-offline', username);
      const updatedUsers = existingUsers.filter((user: string) => user !== username);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    socket.disconnect();

    localStorage.removeItem('login');
    localStorage.removeItem('phoneNumber');

    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <div className="app-grid">
        <button className="app-icon" onClick={() => navigate('/camera')}>
          <FontAwesomeIcon icon={faCamera} size="2x" />
          <span>Camera</span>
        </button>
        <button className="app-icon" onClick={() => navigate('/voice-call')}>
          <FontAwesomeIcon icon={faPhone} size="2x" />
          <span>Voice Call</span>
        </button>
        <button className="app-icon" onClick={() => navigate('/video-call')}>
          <FontAwesomeIcon icon={faVideo} size="2x" />
          <span>Video Call</span>
        </button>
        <button className="app-icon" onClick={() => navigate('/gallery')}>
          <FontAwesomeIcon icon={faImages} size="2x" />
          <span>Gallery</span>
        </button>
        <button className="app-icon" onClick={() => navigate('/messages')}>
          <FontAwesomeIcon icon={faEnvelope} size="2x" />
          <span>Messages</span>
        </button>
        <button className="app-icon" onClick={() => navigate('/settings')}>
          <FontAwesomeIcon icon={faCog} size="2x" />
          <span>Settings</span>
        </button>
      </div>
      <button className="logout-button" onClick={handleLogout}>Disconnect</button>
    </div>
  );
};

export default Home;
