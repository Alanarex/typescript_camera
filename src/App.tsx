import CameraComponent from './pages/camera';
import Geolocalisation from './pages/geolocalisation';
import PhoneCall from './pages/phoneCall';
import Vibrator from './pages/vibrator';
import './App.css';

function App() {
  return (
    <>
      <div className="card">
        <CameraComponent />
      </div>
      <div className="card">
        <Geolocalisation />
      </div>
      <div className="card">
        <PhoneCall />
      </div>
      <div className="card">
        <Vibrator />
      </div>
    </>
  );
}

export default App;
