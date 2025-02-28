import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Geolocation.css';

const Geolocation = () => {
  const [location, setLocation] = useState<string>('Loading...');

  useEffect(() => {
    const storedLocationData = localStorage.getItem('locationData');
    if (storedLocationData) {
      const data = JSON.parse(storedLocationData);
      setLocation(`${data.city}, ${data.country}`);
    } else {
      setLocation('Location data not available');
    }
  }, []);

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
          const locationData = {
            latitude,
            longitude,
            city: data.address.city || 'Unknown',
            country: data.address.country || 'Unknown'
          };
          setLocation(`${locationData.city}, ${locationData.country}`);
          localStorage.setItem('locationData', JSON.stringify(locationData));
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
