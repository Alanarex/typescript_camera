import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from '../context/LocationContext';
import '../styles/Camera.css';

const Camera = () => {
    const [lastPhoto, setLastPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    const { locationData } = useLocation();

    useEffect(() => {
        // Load the last photo from local storage or other storage
        const photo = localStorage.getItem('lastPhoto');
        setLastPhoto(photo);

        // Request camera permission and start the video stream
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCapture = () => {
        if (videoRef.current && locationData) {
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
                    city: locationData.city,
                    country: locationData.country,
                    longitude: locationData.longitude,
                    latitude: locationData.latitude,
                    hour: new Date().toLocaleTimeString(),
                };
                localStorage.setItem('lastPhoto', newPhoto);
                localStorage.setItem(photoId, JSON.stringify(photoDetails));
                const storedPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
                storedPhotos.push(photoId);
                localStorage.setItem('photos', JSON.stringify(storedPhotos));
                setLastPhoto(newPhoto);
            }
        }
    };

    const handleGalleryRedirect = () => {
        // Redirect to the gallery page
        navigate('/gallery');
    };

    return (
        <div className="camera-page">
            {loading ? (
                <div className="loader">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    <video ref={videoRef} className={`camera-video ${window.innerWidth > 768 ? 'wide' : 'long'}`} autoPlay></video>
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
                            <button className="capture-button" onClick={handleCapture}>
                                <FontAwesomeIcon icon={faCamera} size="xl" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Camera;
