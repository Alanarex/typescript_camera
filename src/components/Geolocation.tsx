import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Geolocation.css';

const Geolocation = () => {
  const [location, setLocation] = useState<string>('Loading...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setLocation(`${data.address.city}, ${data.address.country}`);
    });
  }, []);

  return (
    <span className="location">
      <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /> {location}
    </span>
  );
};

export default Geolocation;
