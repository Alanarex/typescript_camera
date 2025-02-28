import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from '../context/LocationContext';
import '../styles/Camera.css';

const Camera = () => {
    const [lastPhoto, setLastPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [locationReady, setLocationReady] = useState<boolean>(false); // ? Track location readiness
    const navigate = useNavigate();
    const { locationData } = useLocation();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Load last photo from storage
        const photo = localStorage.getItem('lastPhoto');
        setLastPhoto(photo);
    }, []);

    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.style.display = "block"; // Ensure it's visible
                    setLoading(false); // Hide spinner once video is ready
                } else {
                    throw new Error("? Video element not found.");
                }
            } catch (error) {
                console.error("Failed to access camera:", error);
            }
        };

        // Ensure video element is mounted before trying to initialize the camera
        const checkVideoElement = setInterval(() => {
            if (videoRef.current) {
                console.log("?? Video element is now available.");
                clearInterval(checkVideoElement);
                initializeMedia();
            } else {
                console.warn("? Video element not found, retrying...");
            }
        }, 100); // Retry every 100ms

        return () => clearInterval(checkVideoElement); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        // ? Ensure locationData is not null before setting readiness
        if (locationData && locationData.latitude !== undefined && locationData.longitude !== undefined) {
            console.log("?? Location data is available.");
            setLocationReady(true);
        } else {
            console.warn("? Waiting for location data...");
        }
    }, [locationData]);

    const handleCapture = () => {
        if (!videoRef.current) {
            console.error("? Video element is missing.");
            return;
        }

        if (!locationReady) {
            console.error("? Location data is missing.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const newPhoto = canvas.toDataURL('image/png');
            const photoId = `photo_${Date.now()}`;
            
            // ? Use optional chaining (`?.`) to avoid TypeScript errors
            const photoDetails = {
                id: photoId,
                dataUrl: newPhoto,
                city: locationData?.city || 'Unknown',
                country: locationData?.country || 'Unknown',
                longitude: locationData?.longitude || 'Unknown',
                latitude: locationData?.latitude || 'Unknown',
                hour: new Date().toLocaleTimeString(),
            };

            localStorage.setItem('lastPhoto', newPhoto);
            localStorage.setItem(photoId, JSON.stringify(photoDetails));
            const storedPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
            storedPhotos.push(photoId);
            localStorage.setItem('photos', JSON.stringify(storedPhotos));
            setLastPhoto(newPhoto);
            console.log("?? Photo captured successfully.");
        }
    };

    const handleGalleryRedirect = () => {
        navigate('/gallery');
    };

    return (
        <div className="camera-page">
            <div className="video-container">
                <video
                    ref={videoRef}
                    className={`camera-video ${window.innerWidth > 768 ? 'wide' : 'long'}`}
                    autoPlay
                    playsInline
                    style={{ display: "block" }}
                ></video>

                {loading && (
                    <div className="loader-overlay">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>

            <div className="button-container">
                <div className="gallery-button-container">
                    <button className="gallery-button" onClick={handleGalleryRedirect}>
                        {lastPhoto ? (
                            <img src={lastPhoto} alt="Last Photo" />
                        ) : (
                            <FontAwesomeIcon icon={faImage} size="2x" />
                        )}
                    </button>
                </div>
                <div className="capture-button-container">
                    <button className="capture-button" onClick={handleCapture} disabled={!locationReady}>
                        <FontAwesomeIcon icon={faCamera} size="xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Camera;
