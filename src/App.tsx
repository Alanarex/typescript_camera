import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
// Import new pages
import Camera from './pages/Camera';
import VoiceCall from './pages/VoiceCall';
import VideoCall from './pages/VideoCall';
import Gallery from './pages/Gallery';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import './styles/index.css'; 
import './styles/App.css'; 
import './styles/NavBar.css'; 

function App() {
  return (
    <>
      <NavBar />
      <Router basename="/typescript_camera">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/voice-call" element={<VoiceCall />} />
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Login />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
