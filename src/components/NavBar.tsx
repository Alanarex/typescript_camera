import Battery from './Battery';
import Geolocation from './Geolocation';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <div className="nav-bar">
      <Geolocation />
      <Battery />
    </div>
  );
};

export default NavBar;
