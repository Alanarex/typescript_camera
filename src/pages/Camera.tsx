import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import '../styles/Camera.css';

const Camera = () => {
    const [lastPhoto, setLastPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [locationReady, setLocationReady] = useState<boolean>(false);
    const navigate = useNavigate();
    const [storedLocationData, setStoredLocationData] = useState(() => {
        const data = localStorage.getItem('locationData');
        return data ? JSON.parse(data) : null;
    });
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const photo = localStorage.getItem('lastPhoto');
        setLastPhoto(photo);
    }, []);

    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.style.display = "block";
                    setLoading(false);
                } else {
                    throw new Error("? Video element not found.");
                }
            } catch (error) {
                console.error("Failed to access camera:", error);
            }
        };

        const checkVideoElement = setInterval(() => {
            if (videoRef.current) {
                console.log("?? Video element is now available.");
                clearInterval(checkVideoElement);
                initializeMedia();
            } else {
                console.warn("? Video element not found, retrying...");
            }
        }, 100);

        return () => clearInterval(checkVideoElement);
    }, []);

    useEffect(() => {
        if (storedLocationData && storedLocationData.latitude !== undefined && storedLocationData.longitude !== undefined) {
            console.log("?? Stored location data is available.");
            setLocationReady(true);
        } else {
            console.warn("? Waiting for stored location data...");
        }
    }, [storedLocationData]);

    useEffect(() => {
        const data = localStorage.getItem('locationData');
        if (data) {
            setStoredLocationData(JSON.parse(data));
        }
    }, []);

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

            const photoDetails = {
                id: photoId,
                dataUrl: newPhoto,
                city: storedLocationData?.city || 'Unknown',
                country: storedLocationData?.country || 'Unknown',
                longitude: storedLocationData?.longitude || 'Unknown',
                latitude: storedLocationData?.latitude || 'Unknown',
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
                        <FontAwesomeIcon icon={faCamera} size="xl" className="imgIcon"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Camera;
