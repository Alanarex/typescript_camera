import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { showNotification } from '../utils/notifications'; // Import the showNotification function

// Import custom marker icon
import customMarkerIcon from "../assets/location-pin.png";

// Create a custom icon
const customIcon = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [38, 38], // size of the icon
  iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // point from which the popup should open relative to the iconAnchor
});

const Geolocalisation = () => {
  const [latitude, setLatitude] = useState<number | null>(null); // State to store the latitude
  const [longitude, setLongitude] = useState<number | null>(null); // State to store the longitude
  const [accuracy, setAccuracy] = useState<number | null>(null); // State to store the accuracy

  // useEffect to get the user's location when the component mounts
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setAccuracy(position.coords.accuracy);

            // Show notification with vibration
            showNotification("Location Loaded", {
              body: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
            }, [200, 100, 200]);
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          { enableHighAccuracy: true } // Request high accuracy
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  // Function to generate Google Maps URL
  const generateGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  return (
    <div>
      <h1>&#128205;Geolocalisation</h1>
      {latitude && longitude ? (
        <div>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
          <p>Accuracy: {accuracy} meters</p>
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]} icon={customIcon}>
              <Popup>
                You are here: <br /> Latitude: {latitude}, Longitude: {longitude}
              </Popup>
            </Marker>
            {accuracy && (
              <Circle
                center={[latitude, longitude]}
                radius={accuracy}
                color="blue"
                fillColor="blue"
                fillOpacity={0.2}
              />
            )}
          </MapContainer>
          <a
            href={generateGoogleMapsUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: "10px" }}
          >
            Open in Google Maps
          </a>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default Geolocalisation;
