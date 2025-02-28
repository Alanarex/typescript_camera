import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Geolocation.css';

const Geolocation = () => {
  const [location, setLocation] = useState<string>('Loading...');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          const data = await response.json();
          setLocation(`${data.address.city}, ${data.address.country}`);
        } catch (error) {
          setLocation('Unable to fetch location');
          console.error(error);
        }
      },
      (error) => {
        setLocation('Geolocation not available');
        console.error(error);
      }
    );
  }, []);

  return (
    <span className="location">
      <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /> {location}
    </span>
  );
};

export default Geolocation;
