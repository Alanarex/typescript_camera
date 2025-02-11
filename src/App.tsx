import CameraComponent from './pages/camera';
import Geolocalisation from './pages/geolocalisation';
import PhoneCall from './pages/phoneCall';
import Vibrator from './pages/vibrator';
import BatteryLevel from './pages/battery';
import OtpValidation from './pages/otpValidation';
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
      <div className="card">
        <BatteryLevel />
      </div>
      <div className="card">
        <OtpValidation />
      </div>
    </>
  );
}

export default App;
